#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <sys/time.h>

#include "heaps.h"

int main()
{

	int val;
	int i;
	char *s;
	srandom( time(NULL) );

	HEAP *heap = createHEAP( 50, MAX_HEAP );
	for ( i = 0; i < 9; i++ )
	{
		val = random()%99;
		char *vstr = malloc( 3 );
		sprintf( vstr, "%d", val );
		printf( "inserting %d\n", val );
		insert( heap, val, (void *) vstr );
		print( heap );
	}
	printf( "\n" );	
	print( heap );
	for ( i = 0; i < 9; i++ )
	{
		char *s = (char *) delete( heap );
		printf( "deleted %s\n", s );
		print( heap );
	}
	for ( i = 0; i < 7; i++ )
	{
		val = random()%99;
		char *vstr = malloc( 3 );
		sprintf( vstr, "%d", val );
		printf( "inserting %d\n", val );
		insert( heap, val, (void *) vstr );
		print( heap );
	}
	print_codes( heap, 0, 0 );
	printf( "calling heapsort\n" );	
	fflush(stdout);
	heapsort( heap );
	printf( "calling printNum\n" );	
	fflush(stdout);
	printNum( heap, 30 );
}