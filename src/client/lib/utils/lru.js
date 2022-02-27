// ---------------------------------------------------------------------------------------------------------------------
// Simple O(1) LRU cache
// ---------------------------------------------------------------------------------------------------------------------

class Node
{
    constructor(key, value, next = null, prev = null)
    {
        this.key = key;
        this.value = value;
        this.next = next;
        this.prev = prev;
    }
}

export class LRU
{
    // Set default limit of 10 if limit is not passed.
    constructor(limit = 10)
    {
        this.size = 0;
        this.limit = limit;
        this.head = null;
        this.tail = null;
        this.cacheMap = {};
    }

    get(key, value)
    {
        const existingNode = this.cacheMap[key];
        if(existingNode)
        {
            this.detach(existingNode);
            this.size--;
        }
        else if(this.size === this.limit)
        {
            delete this.cacheMap[this.tail.key];
            this.detach(this.tail);
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

    set(key)
    {
        const existingNode = this.cacheMap[key];
        if(existingNode)
        {
            const value = existingNode.value;

            // Make the node as new Head of LinkedList if not already
            if(this.head !== existingNode)
            {
                // Write will automatically remove the node from its position and make it a new head i.e. most used
                this.write(key, value);
            }
            return value;
        }

        console.warn(`Item not available in cache for key ${ key }`);
    }

    detach(node)
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

    clear()
    {
        this.head = null;
        this.tail = null;
        this.size = 0;
        this.cacheMap = {};
    }

    // Invokes the callback function with every node of the chain and the index of the node.
    forEach(fn)
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
    *[Symbol.iterator]()
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
