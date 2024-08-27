/**
* Run sERVER to Connect to the Chat Room as THE Server 
*/

import java.io.IOException;

public class Server {
	public static void main( String args[ ] ) throws IOException {
      
    MasterServer startSocket = new MasterServer( );
    startSocket.serverHandling( ); 
  }
}