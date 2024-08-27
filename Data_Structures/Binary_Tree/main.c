#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <time.h>
#include <sys/time.h>
#include "bst.h"

int main()
{
	int val;
	int i;
	char *s;

	BST *bst = createBST();
	for ( i = 0; i < 9; i++ )
	{
		val = random()%77;
		char *vstr = malloc( 3 );
		sprintf( vstr, "%d", val );
		printf( "%d ", val );
		add( bst, val, (void *) vstr );
	}
	
	printf( "\n" );	

	printf( "The size is %d.\n", size( bst ) );
	printf( "The height is %d.\n", height( bst ) );
	print( bst );
	treePrint( bst );
	put( bst, 68, "hello" );
	treePrint( bst );
	s = (char *) removeNode(bst, 68 );
	printf( "deleted %s\n ", (char *) s );
	fflush(stdout);
	treePrint( bst );
}