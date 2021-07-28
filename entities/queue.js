const { EventEmitter }  = require('events');

module.exports.Queue = class Queue extends EventEmitter {
    constructor() {
        super();
        this.items = [];
    }

    enqueue(item, options = Object.create(null)) {
        Object.assign(item, options);
        this.items.push(item);
        this.emit('enqueue', item);
    }

    dequeue() {
        let item = this.items.shift();
        this.emit('dequeue', item);
        return item;
    }

    peek() {
        return this.items[0];
    }

    get isEmpty() {
        return this.items.length === 0;
    }

    get size() {
        return this.items.length;
    }
    get length() {
        return this.items.length;
    }
}