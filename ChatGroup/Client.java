/* 
* Run Client to Connect to the Chat Room as a Client 
*/

import java.io.IOException;
import java.net.Socket;

public class Client {

	public static void main( String [] args ) throws IOException, InterruptedException {

		/* Using socket programming */
		Socket socket = new Socket( "localhost", 1075 );

		/* Class for client to send messages */
		Clientsend clientsend = new Clientsend( socket );
		
		/* GUI */
		Display display = new Display( clientsend );
		
		/* Class for client to recieve messages */
		Clientreceive clientreceive = new Clientreceive( socket, display );

		/* Chat Group GUI */
		display.start( );

		/* start receive thread */
		clientreceive.start( );
	}
}
