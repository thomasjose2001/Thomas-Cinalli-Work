#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include "heaps.h"


// Create a new, empty heap structure and return a pointer to it.
// max is the maximum size of heap required. If the order argument is 0 create a min-heap 
// and if it is 1, the heap should be a max-heap.
HEAP *createHEAP( int max, int order )
{
	HEAP *heap = malloc( sizeof(HEAP) );
	heap->size = 0;
	heap->max = max;
	heap->order = order;

	heap->nodes = malloc( sizeof(heapNode *) * max );
}

// destroy the heap, freeing just the data 
//     allocated by the heap implementation
void destroyHEAP( HEAP *heap )
{
	int i;

	// if nodes are there, delete them
	for ( i = 0; i < heap->size; i++ )
		free( heap->nodes[i] );
	free( heap );
}

// If a swap with the parent is required,
// return the parent index
// Otherwise return -1
int compare_parent( HEAP *heap, int index )
{
	int parent = floor((index-1)/2);

	if ( heap->nodes[parent]->key == heap->nodes[index]->key )
		parent = -1;
	else if ( heap->nodes[parent]->key < heap->nodes[index]->key )
	{
		if ( heap->order == MIN_HEAP )
			parent = -1;	// don't switch
	}
	else if ( heap->order == MAX_HEAP )
		parent = -1;	// don't switch
	return parent;
}

// recursively check a node's parent to see if a swap
// is required, stop when it's not OR when the root is reached
void heapify_up( HEAP *heap, int index )
{
	int parent;
	if (index == 0)
		return;	
	if ( (parent = compare_parent( heap, index )) >= 0 )
	{
		heapNode *tmp = heap->nodes[index];
		heap->nodes[index] = heap->nodes[parent];
		heap->nodes[parent] = tmp;
		heapify_up( heap, parent );
	}
}

// Insert a node with the given key and value into the heap
// The HEAP is responsible for allocating a node
// Return -1 on error (eg, no room in the heap), and 0 on success
// Obey the ordering specified when the heap was created
int insert( HEAP *heap, int key, void *value )
{
	if ( heap->size == heap->max )
		return( -1 );
	heapNode *hn = malloc( sizeof(heapNode) );
	hn->key = key;
	hn->value = value;

	heap->nodes[heap->size] = hn;
	if ( heap->size > 0 )
		heapify_up( heap, heap->size );
	heap->size++;
	return( 0 );
}

// Check if a swap between a parent and child is required
// based on the HEAP type, and do it
// return 1 if a swap was done, 0 if not
int swap_child( HEAP *heap, int parent, int child )
{
	int retval = 1; // swap
	if ( heap->nodes[parent]->key == heap->nodes[child]->key )
		retval = 0;  // no swap
	else if ( heap->nodes[parent]->key > heap->nodes[child]->key )
	{
		if ( heap->order == MAX_HEAP )
			retval = 0;	//  no swap
	}
	else if ( heap->order == MIN_HEAP )
			retval =  0;	// no swap
	if ( retval == 1 )
	{
		heapNode *tmp = heap->nodes[parent];
		heap->nodes[parent] = heap->nodes[child];
		heap->nodes[child] = tmp;
	}
	return retval;
}

// Find the largest/smallest of 2 children, based on the HEAP type
int compare_children( HEAP *heap, int lc, int rc )
{
	int retChild = lc;
	if ( heap->nodes[lc]->key <= heap->nodes[rc]->key )
	{
		if ( heap->order == MAX_HEAP )
			retChild = rc;	// choose the larger one
	}
	else if ( heap->order == MIN_HEAP )
			retChild = rc;	// choose the smaller one
	return retChild;
}


// recursively move a node from the root to its correct position
// based on the HEAP type
void heapify_down( HEAP *heap, int index )
{
	int lc = index*2 + 1;
	int rc = index*2 + 2;
	
	if ( lc >= heap->size )
		// reached a leaf
		return;
	if ( rc >= heap->size )
	{
		// one child
		if ( swap_child( heap, index, lc ) )
			heapify_down( heap, lc );
	}
	else
	{
		int child = compare_children( heap, lc, rc );
		if ( swap_child( heap, index, child ) )
			heapify_down( heap, child );
	}
}

	
// safely remove the root node of the HEAP
// free the node and return the pointer to the value
// or NULL if the heap is empty
void *delete( HEAP *heap )
{
	if ( heap->size == 0 )
		return NULL;
	void *retval = heap->nodes[0]->value;
	free( heap->nodes[0] );
	heap->size--;
	if ( heap->size == 0 )
		return retval;
	heap->nodes[0] = heap->nodes[heap->size];
	heapify_down( heap, 0 );
	return retval;
}

// sort the heap in place (no other array), which should make its size 0
// don't delete the nodes because they will be printed
void heapsort( HEAP *heap )
{
	heapNode *tmp;
	while ( heap->size > 1 )
	{
		heap->size--;
		// Don't free the node, just swap it with the last node
		tmp = heap->nodes[0];
		heap->nodes[0] = heap->nodes[heap->size];
		heap->nodes[heap->size] = tmp;
		heapify_down( heap, 0 );
	}
}

// return the number of nodes in the heap
int size( HEAP *heap );

// print the keys of the heap in the order they appear in the array
void print( HEAP *heap)
{
	int i;
	for ( i = 0; i < heap->size; i++ )
		printf( "%d ", heap->nodes[i]->key );
	printf( "\n" );
}

// print the first num keys from the array, valid or not
void printNum( HEAP *heap, int num )
{
	int i;
	for ( i = 0; i < num; i++ )
		printf( "%d ", heap->nodes[i]->key );
	printf( "\n" );
}