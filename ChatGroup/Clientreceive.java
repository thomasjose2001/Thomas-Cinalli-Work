/* 
*  Class that focuses on receiving messages
*/

import java.io.IOException;
import java.io.DataInputStream;
import java.net.Socket;

public class Clientreceive extends Thread {

	private Socket socket;
	private DataInputStream inputStream;     
	private Display display;
	private final int maxMsgSize = 8000000;
	private boolean first = false;
	
	/* Constructor: socket, display */
	public Clientreceive( Socket soc, Display disp ) throws IOException {

		this.socket = soc;
		this.inputStream = new DataInputStream( soc.getInputStream( ) );
		this.display = disp;
	}

  	/* method to interpret server messages */
	/* reading thread */
	public void run( ) {
	  
		byte [] byteMsg = new byte[maxMsgSize];
		
		int length = 0;
		int sts;
		
		String message = "";
		
		while ( true ) {
			
			try {

				/* Read message when it arrives */
				do { 

					/* keep reading from inputstream (not a blocking call) */
					sts = inputStream.read( byteMsg, length, maxMsgSize - length );
					
					if( sts > 0 ) {

						length += sts;	
						message = new String( byteMsg, 0, length );
					}

				} while ( !message.contains( "\r\n" ) );
				
				/* Make length 0 again */
				length = 0;
				
				if ( first && message.contains( "JOINX" ) ) {

					first = false;
					continue;
				}
				
				/* MSG: received a message
				 * GROUP: receive the list of all clients in the chat
				 * JOIN: 1 client joined
				 * LEAVE: got notice of a client who left
				*/

				if ( message.contains( "GROUP" ) ) {

					/* Pass a list containing all the participants in the chat */
					display.clientGroup( message.substring( 6 ).replace( "\r\n", "" ).split( " " ) );
					
					first = true;
				}
				
				else if ( !first && message.contains( "JOINX" ) ) {

					/* Append to the GUI client list( left JArea ) */
					display.clientJoin( message.substring( 6 ).replace( "\r\n", "" ) );
				}

				else if ( message.contains( "MESSG" ) ) {

					/* pass the message */
					System.out.println("Received a message! " + message);
					
					display.clientMessage( message.substring( 6 ).replace( "\r\n", "" ) );
				}

				else if ( message.contains( "LEAVE" ) ) {

					/* Pass the name of the user who left */
					display.clientLeave(message.substring( 6 ).replace( "\r\n", "" ) );
				}

				else {

					System.out.println( "Unrecognized send request" );
				}
			}
			catch( IOException ex ) {    

				try {

					socket.close( );
				}
				catch ( IOException ex1 ) {    

					System.exit( 0 );
				}  
			}
		}
	}
}