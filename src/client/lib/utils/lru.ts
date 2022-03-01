// ---------------------------------------------------------------------------------------------------------------------
// Simple O(1) LRU cache
// ---------------------------------------------------------------------------------------------------------------------

// eslint-disable-next-line no-use-before-define
type MaybeNode = Node | null;

// ---------------------------------------------------------------------------------------------------------------------

class Node
{
    key : string;
    value : any;
    next : MaybeNode;
    prev : MaybeNode;

    constructor(key : string, value : any, next : MaybeNode = null, prev : MaybeNode = null)
    {
        this.key = key;
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

// ---------------------------------------------------------------------------------------------------------------------

export class LRU
{
    size : number;
    limit : number;
    head : MaybeNode;
    tail : MaybeNode;
    cacheMap : Record<string, Node>;

    // Set default limit of 10 if limit is not passed.
    constructor(limit = 10)
    {
        this.size = 0;
        this.limit = limit;
        this.head = null;
        this.tail = null;
        this.cacheMap = {};
    }

    set(key : string, value : any) : void
    {
        const existingNode = this.cacheMap[key];
        if(existingNode)
        {
            this.detach(existingNode);
            this.size--;
        }
        else if(this.size === this.limit)
        {
            if(this.tail)
            {
                delete this.cacheMap[this.tail.key];
                this.detach(this.tail);
            }

            this.size--;
        }

        // Write to head of LinkedList
        if(!this.head)
        {
            this.tail = new Node(key, value);
            this.head = this.tail;
        }
        else
        {
            const node = new Node(key, value, this.head);
            this.head.prev = node;
            this.head = node;
        }

        // update cacheMap with LinkedList key and Node reference
        this.cacheMap[key] = this.head;
        this.size++;
    }

    get(key : string) : any
    {
        const existingNode = this.cacheMap[key];
        if(existingNode)
        {
            const value = existingNode.value;

            // Make the node as new Head of LinkedList if not already
            if(this.head !== existingNode)
            {
                // Write will automatically remove the node from its position and make it a new head i.e. most used
                this.set(key, value);
            }
            return value;
        }
    }

    detach(node : Node) : void
    {
        if(node.prev !== null)
        {
            node.prev.next = node.next;
        }
        else
        {
            this.head = node.next;
        }

        if(node.next !== null)
        {
            node.next.prev = node.prev;
        }
        else
        {
            this.tail = node.prev;
        }
    }

    clear() : void
    {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.cacheMap = {};
    }

    // Invokes the callback function with every node of the chain and the index of the node.
    forEach(fn : (node : Node, counter : number) => void) : void
    {
        let node = this.head;
        let counter = 0;
        while(node)
        {
            fn(node, counter);
            node = node.next;
            counter++;
        }
    }

    // To iterate over LRU with a 'for...of' loop
    *[Symbol.iterator]() : Iterator<Node>
    {
        let node = this.head;
        while(node)
        {
            yield node;
            node = node.next;
        }
    }
}

// ---------------------------------------------------------------------------------------------------------------------
