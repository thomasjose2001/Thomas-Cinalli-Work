// Interface for a somewhat generic binary search tree

typedef struct node {
	int key;
	void *value;
} heapNode;

typedef struct bst {
	int max;
	int size;
	int order;
	heapNode **nodes;
} HEAP;

#define MIN_HEAP 0
#define MAX_HEAP 1


// Create a new, empty heap structure and return a pointer to it.
// max is the maximum size of heap required (so you can create
// the heap array).  If the order argument is 0 create a min-heap 
// and if it is 1, the heap should be a max-heap.
HEAP *createHEAP( int max, int order );

// destroy the heap, freeing just the data 
//     allocated by the heap implementation
// If your heap implementation didn't allocate it, 
//      it's not your responsibility
void destroyHEAP( HEAP *heap );

// Insert a node with the given key and value into the heap
// The HEAP is responsible for allocating a node
// Return -1 on error (eg, no room in the heap), and 0 on success
// Obey the ordering specified when the heap was created
int insert( HEAP *heap, int key, void *value );

// safely remove the root node of the HEAP
// free the node and return the pointer to the value
// or NULL if the heap is empty
void *delete( HEAP *heap );

// sort the heap in place (no other array), which should make its size 0
// don't delete the nodes because they will be printed
void heapsort( HEAP *heap );

// return the number of nodes in the heap
int size( HEAP *heap );

// print the keys of the heap in the order they appear in the array
void print( HEAP *heap);

// print the first num keys from the array, valid or not
void printNum( HEAP *heap, int num );
