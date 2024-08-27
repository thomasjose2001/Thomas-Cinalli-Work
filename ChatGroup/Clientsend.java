/*
* Class focused on letting the client send messages
*/

import java.io.IOException;
import java.io.DataOutputStream;
import java.net.Socket;
import java.nio.ByteBuffer;

public class Clientsend {

  private Socket socket;
  private DataOutputStream outputStream;

  /* Constructor: socket*/
  public Clientsend( Socket soc ) throws IOException {

    this.socket = soc;
    this.outputStream = new DataOutputStream( soc.getOutputStream( ) );
  }

  /* send options: */
  /* JOIN nameCRLF */
  /* MSG messageCRLF */
  public boolean sendMsg( String proc, String nmeOrMsg ) throws IOException {

    try {

      String message = proc + " " + nmeOrMsg + "\r\n";
    
      outputStream.write( message.getBytes( ) ); 
      
      return true;
    
    } catch( IOException e1 ) {

      socket.close( );
      return false;
    }
  }

  public boolean sendMsg( String proc ) throws IOException {

    try {

      String message = proc + "\r\n";
      outputStream.write( message.getBytes( ) ); 
      return true;
    
    } catch( IOException e2 ) {

      socket.close( );
      return false;
    }
  }

  public boolean sendMsg( String proc, int Size, byte[ ] imageBody ) throws IOException {

    try {	

      // Convert int Size into byte[ ] imageBody 
      byte[ ] intBytes = ByteBuffer.allocate( 4 ).putInt( Size ).array( );
      
      // Convert String proc into byte[ ] proc
      byte[ ] protocol = proc.getBytes( );
      
      // Allocate for byte array ( append all items )
      byte[ ] allBytes = new byte[ Size + 9 ];

      for ( int i = 0; i < 5; i++ )
        allBytes[ i ] = protocol[ i ];
      
      for ( int i = 0; i < 4; i++ )
        allBytes[ i + 5 ] = intBytes[ i ];
      
      for ( int i = 400; i < 500; i++ )
        System.out.println( "Contents HERE: " + allBytes[ i ] );
      
      outputStream.write( allBytes ); 
        return true;
    }
    catch( IOException e1 ) {
      
      socket.close( );
      return false;
    }
  }
}