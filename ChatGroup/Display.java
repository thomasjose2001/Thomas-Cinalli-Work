/*  
* Display GUI
*/

import java.io.IOException;
import java.awt.event.ActionListener;
import java.awt.event.WindowAdapter;
import java.awt.event.WindowEvent;
import java.awt.event.ActionEvent;
import javax.swing.JFrame;

import java.awt.Color;
import javax.swing.SpringLayout;
import javax.swing.JButton;

import javax.swing.JTextField;
import javax.swing.JTextArea;
import java.awt.Font;
import javax.swing.JOptionPane;
import javax.swing.BorderFactory;

public class Display extends Thread {

	private Clientsend clientsend;
	private String name;
	private JFrame frame;
	private JButton send;
	private JTextField textField;
	JTextArea textArea;
	JTextArea textArea_1;

	/**
	 * Launch the application.
	*/
	public void run( ) {

		try {

			initialize( );
		
		} catch( IOException ex ) {

			System.out.println( "Exit" );
		}
	}

	/**
	 * Pass the Clientsend object.
	 */
	public Display( Clientsend clientsend )  {

		this.clientsend = clientsend;
		frame = new JFrame( );
		send = new JButton( "Send" );
		textArea = new JTextArea( );
		
		textArea.setEditable( false );
		textArea.setBorder( BorderFactory.createLineBorder( Color.BLACK, 1 ) );
		
		textArea_1 = new JTextArea( );
		textArea_1.setEditable( false );
		textField = new JTextField( );
	}

	/**
	 * Initialize the contents of the frame.
	 */
	private void initialize( ) throws IOException  {

		frame.setBounds( 100, 100, 1186, 460 );
		frame.setDefaultCloseOperation( JFrame.EXIT_ON_CLOSE );
		
		SpringLayout springLayout = new SpringLayout( );
		frame.getContentPane( ).setLayout( springLayout );

    	/* Prompt name to user */
		name = JOptionPane.showInputDialog( frame, "Name" );

		/* Identify yourself to the server */
		clientsend.sendMsg( "JOINX", name );
				
		/* When a client closes a window, alert all other users with Clientsend Class */
		frame.addWindowListener( new WindowAdapter( ) 
		{	
            @Override
            public void windowClosing( WindowEvent e ) 
            {          
            	try 
            	{
					clientsend.sendMsg( "LEAVE" );
				} 
                catch (IOException e1) 
            	{
					e1.printStackTrace();
				}
            }
        } );
				
		send.addActionListener( new ActionListener( )
		{
			public void actionPerformed( ActionEvent e )
			{
			    //if it was not succesful, show up a window with warning
			    try 
			    {
					if ( !(Display.this.clientsend.sendMsg( "MESSG" , textField.getText( ) ) ) )
						System.out.println( "Couldn't send msg to server." );
					
					/* display message in the display */
					//clientMessage( name + ": " + textField.getText( ) );
					
					/* Erase contents of the message sent */
					textField.setText("");
			    }
			    catch( IOException ex )
			    {
			      ex.printStackTrace( );
			    }
			}
		} ); 
    
		/* Send Button */	
		springLayout.putConstraint(SpringLayout.SOUTH, send, -5, SpringLayout.SOUTH, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.EAST, send, -5, SpringLayout.EAST, frame.getContentPane());
		send.setFont(new Font("Bahnschrift", Font.PLAIN, 10));
		send.setForeground(Color.BLACK) ;
		frame.getContentPane().add(send);

   		/* Right Text Area */
		springLayout.putConstraint(SpringLayout.NORTH, textArea, 10, SpringLayout.NORTH, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.WEST, textArea, 213, SpringLayout.WEST, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.SOUTH, textArea, -73, SpringLayout.SOUTH, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.EAST, textArea, -10, SpringLayout.EAST, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.NORTH, send, 19, SpringLayout.SOUTH, textArea);
		frame.getContentPane().add(textArea);

    	/* Left Text Area */
		springLayout.putConstraint(SpringLayout.NORTH, textArea_1, 10, SpringLayout.NORTH, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.SOUTH, textArea_1, -10, SpringLayout.SOUTH, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.WEST, send, 845, SpringLayout.EAST, textArea_1);
		springLayout.putConstraint(SpringLayout.WEST, textArea_1, 16, SpringLayout.WEST, frame.getContentPane());
		springLayout.putConstraint(SpringLayout.EAST, textArea_1, -992, SpringLayout.EAST, frame.getContentPane());
		frame.getContentPane().add(textArea_1);
    
		/* Put your name in the participant area !!!*/
		textArea_1.append( name );
    
		springLayout.putConstraint(SpringLayout.NORTH, textField, 0, SpringLayout.NORTH, send);
		springLayout.putConstraint(SpringLayout.WEST, textField, 33, SpringLayout.EAST, textArea_1);
		springLayout.putConstraint(SpringLayout.SOUTH, textField, 0, SpringLayout.SOUTH, send);
		springLayout.putConstraint(SpringLayout.EAST, textField, -42, SpringLayout.WEST, send);
		frame.getContentPane().add(textField);
		textField.setColumns(10);
				
		/* start window */
		try {

			this.frame.setVisible( true );
		
		} catch ( Exception e ) {

			e.printStackTrace( );
		}
	}

	public void clientJoin( String user ) {

		textArea_1.append("\n");	// Get rid of for Mona's code
		textArea_1.append( user );
	}

	public void clientGroup( String[ ] names ) {

		for ( int i = 0; i < names.length; i++ ) {
				
			textArea_1.append("\n");	
			textArea_1.append( names[ i ] );
		}
	}

	public void clientMessage( String msg ) {

		textArea.append( msg + "\n" );
	}

	public void clientLeave( String userLeave ) {

		//System.out.println("im in the last step" );
		textArea_1.setText( textArea_1.getText().replaceAll( userLeave, "" ) );
		textArea.append( "User: " + userLeave + " has left the chat" );
	}
}
