/**
 * Class focused on handling server logic 
*/

import java.net.ServerSocket;
import java.io.IOException;
import java.net.Socket;
import java.util.ArrayList;
import java.io.DataOutputStream;
import java.io.DataInputStream;

/**
 *        GUIDE : FORMAT
 *  1. Constructor : Initialize Socket  
 *  2. Start the server : accept method, create a new thread
 *  3. Close the socket 
 *  4. Find way to send socket number to client  
*/

public class MasterServer {

  private ServerSocket socket;
  private DataInputStream inputStream;     /* Send data to that output stream */
  private DataOutputStream outputStream;
  private ArrayList<ClientHandler> clientList;
      
  /**
   * Constructor With Parameters
   * @param socket Server Socket : Used to keep connection from the server side 
  */

  public MasterServer( ) throws IOException {

    this.socket = new ServerSocket( 1075 );
    
    /* Client List */
    this.clientList = new ArrayList<ClientHandler>( );
  }

  /* Protocol */
  public void serverHandling( ) {

    byte [] byteMsg = new byte[ 10000 ];
    int length = 0;

    /* Buffer containing name */
    String currName; 
    Socket client;
    
    try {

      System.out.println( "MasterServer: WAITING FOR CLIENT..." );
      
      /* Listening Loop */
      while( true ) {

        /* blocking call: accept as many clients as possible */
        client = this.socket.accept( ); 
        System.out.println("MasterServer: Connection Accepted.");

        /* Server Purpose: create ClientHandlers when required */
        inputStream = new DataInputStream(  client.getInputStream( )  );
    
        /* Keep checking until you reach /r/n */
        do
        {
          /* keep track of offset!! */
          length += inputStream.read(byteMsg, length, 10000 - length);
          System.out.println("number of bytes read: " + length);
          currName = new String( byteMsg, 0, length );
          System.out.println("reading name");
        } while ( !currName.contains("\r\n") );
    
        length = 0;
        if ( currName.contains( "JOINX" ) ) {

        /* create the new client and add it to the list of clients */
        ClientHandler nextClient = new ClientHandler( client, clientList, currName.substring( 6 ).replace( "\r\n", "" ) );
        
          /* start Client dedicated thread */
          nextClient.start();  
        } 
        /* Client has sent an invalid request */
        else 
        {
          outputStream = new DataOutputStream( client.getOutputStream( )  );
          outputStream.writeBytes( "MasterServer: Invalid Request." );
        }
      }
    }
    catch( IOException e ) {
                
      e.getStackTrace( );
      e.printStackTrace( );         
    }
  }   
}
