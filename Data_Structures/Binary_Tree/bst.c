// Interface for a somewhat generic binary search tree

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include "bst.h"

// create a new, empty BST and return a pointer to it
BST *createBST()
{
	BST *bst = malloc( sizeof(BST) );
	bst->root = NULL;
	bst->size = 0;

	return bst;
}

void freeTree( treeNode *root )
{
	if ( root->left != NULL )
		freeTree( root->left );
	if ( root->right != NULL )
		freeTree( root->right );
	free( root );
}

// destroy the BST, freeing all the data allocated by the BST implementation
// If your BST implementation didn't allocate it, it's not your responsibility
void destroyBST( BST *bst )
{
	if ( bst->root != NULL )
		freeTree( bst->root );
	free( bst );
}

treeNode *findParent( treeNode *root, int key )
{ 
	if (root == NULL)
		return NULL;
	if ( (root->left && (root->left->key == key)) || (root->right && (root->right->key == key)) )
		return root;	
	if ( key < root->key )
		return findParent( root->left, key );
	if ( key > root->key )
		return findParent( root->right, key );
}

void *findNode( treeNode *root, int key )
{
	if (root == NULL)
		return NULL;
	if (key == root->key)
		return root->value;	
	if ( key < root->key )
		return findNode( root->left, key );
	if ( key > root->key )
		return findNode( root->right, key );
}

// search for the key in the BST
// If it's found, return a pointer to the value data
// If not found, return a NULL
void *get( BST *bst, int key )
{
	return( findNode( bst->root, key ) );
}

// Just like get, but instead of returning the value,
// it returns a non-zero integer if the item is found or 0 if not found
int contains( BST *bst, int key )
{
	if ( findNode( bst->root, key ) == NULL )
		return 0;
	else
		return 1;
}

int insertNode( treeNode *root, treeNode *new, int repl )
{
	int found = 0;
	if (new->key == root->key)
	{
		if (repl)
			root->value = new->value;
		found = 1;
	}
	else if ( new->key < root->key )
	{
		if (root->left == NULL)
			root->left = new;
		else
			return insertNode( root->left, new, repl );
	}
	else // if ( key > root->key )
	{
		if (root->right == NULL)
			root->right = new;
		else
			return insertNode( root->right, new, repl );
	}
	return found;
}

int internalInsert( BST *bst, int key, void *value, int repl )
{
	int found = 0;
        treeNode *p = malloc(sizeof(treeNode));

	// Make a new treeNode
        p->key = key;
        p->value = value;
        p->left = NULL;
        p->right = NULL;

	if ( bst->root == NULL )
		bst->root = p;
	else
        	found = insertNode( bst->root, p, repl );
	if (!found) 
		bst->size++;
	return found;
}

// insert a node with the given key and value into the tree
// the BST is responsible for allocating a node
// return -1 on error, 1 if the key already exists in the tree, and 0 on success
int add( BST *bst, int key, void *value )
{
	internalInsert( bst, key, value, 0 );
}

// the same as add except that if the key is a duplicate and you are returning 1,
//    then, REPLACE the current data (value) with the data that was passed in
int put( BST *bst, int key, void *value )
{
	internalInsert( bst, key, value, 1 );
}

treeNode *findSuccessorSwap( treeNode *base )
{
	// only calling this on a 2-child node 
	treeNode *p, *prev, *save;

	printf( "findsuccessor on %d.\n", base->key );

	// Maybe the right child is the successor
	p = base->right;

	// find the leftmost item in the right sub-tree
	if ( p->left != NULL )
	{
		for ( prev = p, p = p->left; p->left != NULL; prev = p, p = p->left );
	
		// since this is the leftmost, there is no left child
		// so hook to the right child if there is one (NULL or not)
		prev->left = p->right;
	}
	else
	{
		printf( "right child is successor.\n" );

		// since there is no left jump over the right side (NULL or not no matter)
		base->right = p->right;
	}
	// swap the data and send the successor back to be freed
	// the reattachments are already done - no recursive call
	base->key = p->key;
	base->value = p->value;
	save = p;
	return save;
	
}

void *doDelete( treeNode **attach, int key )
{
	treeNode *saveNode = *attach;
	void *saveValue = NULL;
	if ( saveNode->key == key )
	{
		saveValue = saveNode->value;
		if ( saveNode->left != NULL && saveNode->right != NULL )
			saveNode = findSuccessorSwap( saveNode );
		else if ( saveNode->left == NULL && saveNode->right == NULL )	
			*attach = NULL;
		else if ( saveNode->left != NULL )
			*attach = saveNode->left;
		else if ( saveNode->right != NULL )
			*attach = saveNode->right;
		free( saveNode );
	}
	return saveValue;
}

// safely remove the node identified by key from the BST
// free the node and return the pointer to the value
// if the value is not in the BST, return NULL
void *removeNode( BST *bst, int key )
{
	treeNode *parent;
	void *retVal;

	if ( bst->root == NULL )
		return( NULL );

	// check the root special case
	if (( retVal = doDelete( &bst->root, key )) != NULL )
		return( retVal );

	//  Try to find the parent of the node to be deleted OR it does not exist
	if ((parent = findParent( bst->root, key )) == NULL )
		return NULL;

	// Now check the direction - LEFT SIDE - is this the node?
	if (parent->left != NULL )
	{
		if (( retVal = doDelete( &parent->left, key )) != NULL )
			return( retVal );
	}

	// If it wasn't the left, then it must be the RIGHT, so no test is required
	if (( retVal = doDelete( &parent->right, key )) != NULL )
		return( retVal );

	// Can't really reach here ... but
	return NULL;
}
	
// return the number of nodes in the tree
int size( BST *bst )
{
	return bst->size;
}

int findHeight( treeNode *root, int height )
{
	int hr, hl;
	if (root == NULL)
		return height;
	height++;
	hl = findHeight( root->left, height );
	hr = findHeight( root->right, height );
	if (hl > hr )
		return hl;
	else
		return hr;
}

// return the number of levels in the tree
// if the tree is empty, return -1
// a tree with just one node (the root) has height 0
int height( BST *bst )
{
	if (bst->root == NULL)
		return -1;
	return findHeight( bst->root, -1 );
}
	

void inorderPrint( treeNode *root )
{
	if (root == NULL)
		return;
	inorderPrint( root->left );
	printf( "%d\n", root->key );
	inorderPrint( root->right );
}

// print the keys of the tree in order (ie, using in order traversal)
void print( BST *bst)
{
	inorderPrint( bst->root );
}


void createArray( treeNode *root, int loc, int **val )
{
	if (root == NULL)
		return;
	val[loc] = malloc(sizeof(int));
	*val[loc] = root->key;
	createArray(root->left, loc*2+1, val );
	createArray(root->right, loc*2+2, val );
}

// Extra credit: print the tree in a way such that its structure is visible
void treePrint( BST *bst )
{
	int **val;
	int h, i, j, k;
	int lower, upper, first, rest;
	if (bst->root == NULL)
	{
		printf( "Empty BST\n" );
		return;
	}
	h = findHeight( bst->root, -1 );
	h++;
	upper = (int)pow(2,h);
	val = malloc( upper*sizeof(int *) );
	for ( i = 0; i < upper; i++ )
		val[i] = NULL;
	createArray( bst->root, 0, val );
	for ( j = 0; j < h; j++ )
	{
		lower = ((int)pow(2,j)) - 1;
		upper = ((int)pow(2,j+1)) - 1;
		for ( i = lower; i < upper; i++ )
		{
			first = ((int)pow(2,h-j-1)) - 1;
			rest = ((int)pow(2,h-j)) - 1;
			if ( i == lower )
				for ( k = 0; k < first; k++ )
					printf("  ");
			else
				for ( k = 0; k < rest; k++ )
					printf("  ");
			if (val[i] == NULL)
				printf("%s", "**");
			else
				printf("%d", *val[i]);
		}
		printf("\n\n");
	}
}
