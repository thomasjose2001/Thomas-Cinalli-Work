/* 
* Class that focuses on client protocol handling
*/

import java.io.IOException;
import java.io.DataInputStream;
import java.io.DataOutputStream;
import java.net.Socket;
import java.util.ArrayList;

public class ClientHandler extends Thread {
		
	private Socket socket;
	private DataInputStream inputStream;     
	private DataOutputStream outputStream;    
	private ArrayList<ClientHandler> users;
	private String name;
	private int bufsize = 8000000;
	private byte [] byteMsg; /* Raw Message in bytes */

	/**
	 * Constructor with Parameters 
	*/
	public ClientHandler( Socket socket, ArrayList<ClientHandler> clients, String name ) throws IOException {

		this.socket = socket;
		this.outputStream = new DataOutputStream( socket.getOutputStream( ) );
		this.inputStream = new DataInputStream( socket.getInputStream( ) );
		this.users = clients;
		this.name = name;
		this.byteMsg = new byte[bufsize];
	}   

	/* get name of the client */
	public String getClientName( ) {

		return this.name;
	}

	/* used to send correspondance to client */
	public void clientSend( String msg ) throws IOException {

		this.outputStream.write( msg.getBytes( ) );
	}

	public void clientSend( byte [] msg ) throws IOException {

		this.outputStream.write( msg );
	}

	@Override
	public void run( ) {

		byteMsg = new byte[ bufsize ]; /* Raw Message in bytes */
		
		String msg = "";
		String request; /* client request */
		String participants = ""; /* participant string */
		
		int sts;
		int length = 0;
	
		try {
			
			/* Gather Names */
			if ( users.size() != 0 ) {

				for ( ClientHandler c : users ) {

					participants = participants + c.getClientName( );
					participants += " ";
				}
	
				/* Remove extra space */
				participants = participants.substring( 0, participants.length() - 1 );
	
				/* -- Group Server Protocol-- send all participants to the client */
				this.clientSend( "GROUP " + participants + "\r\n" );
			}
	
			/* -- Join Server Protocol -- 
			send new participant to the currently connected clients */
			for ( ClientHandler c : users ) {
				
				c.clientSend( "JOINX " + name + "\r\n" );
			}
	
			/* Add new user to the list */
			users.add( this );
	
			/* Dedicated client request satisfaction */
			while ( true ) {

				length = 0; // Reset length for each new message
				msg = "";   // Reset the msg string for each new message
				
				do {

					/* keep reading from inputstream ( not a blocking call ) */
					sts = inputStream.read( byteMsg, length, bufsize - length );
	
					if ( sts > 0 ) {

						length += sts;
						msg = new String( byteMsg, 0, length );
					}
	
				} while ( !msg.contains( "\r\n" ) );
	
				request = msg.substring( 0, 5 );    // Not getting rid of /r/n in LEAVE
	
				/* -- Message Client Protocol -- 
					send message to the whole group */
				if ( request.equals( "MESSG" ) ) {
					
					for ( ClientHandler c : users ) {
						
						c.clientSend( "MESSG " + name + " " + msg.substring( 6 ) );
					}
				}
	
				/* -- Leave Client Protocol --
					sends leave to the whole group */
				if ( request.equals( "LEAVE" ) ) {
	
					users.remove( this );
	
					for ( ClientHandler c : users ) {
						
						c.clientSend( "LEAVE " + name + "\r\n" );
					}
	
					/* stop loop */
					break;
				}
	
				/* JOIN Client Protocol */
				if ( request.equals( "JOINX" ) ) {
					
					/* Send it to everyone but that new client */
					for ( ClientHandler c : users ) {
						c.clientSend( msg );
					}
				}
	
				byteMsg = new byte[ bufsize ]; // Clear the byte buffer after processing
			}
		} catch ( IOException e ) {
			try {

				socket.close( );
			} catch ( IOException ex ) {

				System.exit( 0 );
			}
		}
	}
}