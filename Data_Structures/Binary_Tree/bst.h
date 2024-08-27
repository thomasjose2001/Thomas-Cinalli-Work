// Interface for a somewhat generic binary search tree

typedef struct node {
	int key;
	void *value;
	struct node *left;
	struct node *right;
} treeNode;

typedef struct bst {
	// You may add other information here that is useful to your implementation
	// but nothing else in this file should be changed
	int size;
	treeNode *root;
} BST;

// create a new, empty BST and return a pointer to it
BST *createBST();

// destroy the BST, freeing all the data allocated by the BST implementation
// If your BST implementation didn't allocate it, it's not your responsibility
void destroyBST( BST *bst );

// search for the key in the BST
// If it's found, return a pointer to the value data
// If not found, return a NULL
void *get( BST *bst, int key );

// Just like get, but instead of returning the value,
// it returns a non-zero integer if the item is found or 0 if not found
int contains( BST *bst, int key );

// insert a node with the given key and value into the tree
// the BST is responsible for allocating a node
// return -1 on error, 1 if the key already exists in the tree, and 0 on success
int add( BST *bst, int key, void *value );

// the same as add except that if the key is a duplicate and you are returning 1,
//    then, REPLACE the current data (value) with the data that was passed in
int put( BST *bst, int key, void *value );

// safely remove the node identified by key from the BST
// free the node and return the pointer to the value
// if the value is not in the NST, return NULL
void *remove( BST *bst, int key );

// return the number of nodes in the tree
int size( BST *bst );

// return the number of levels in the tree
// if the tree is empty, return -1
// a tree with just one node (the root) has height 0
int height( BST *bst );

// print the keys of the tree in order (ie, using in order traversal)
void print( BST *bst);

// Extra credit: print the tree in a way such that its structure is visible
// uncomment the prototype only if you implement it
void treePrint( BST *bst );

//Helper Functions
treeNode *getNode(treeNode *pnode, int key);

treeNode *findSuccessorSwap(treeNode *base);

treeNode *findParent(treeNode *root, int key);

void *doDelete(treeNode **attach, int key);

void *removeNode(BST *bst, int key);

void print_helper(treeNode* bst);

void destroyBST_helper(treeNode* pnode);

void *min_helper(treeNode *pnode);

void *min(BST *bst);

void treePrint_helper( treeNode *pnode, int level);

void *get_helper(treeNode *pnode, int key);

int put_helper(treeNode *pnode, int key, int holder, void* value);

int findNode(treeNode* pnode, int key);

int add_helper(treeNode *pnode, int key, void* value);

int contains_helper(treeNode *pnode, int key);

int size_helper(treeNode* pnode);

int height_helper(treeNode* pnode);