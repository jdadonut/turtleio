const { EventEmitter } = require('events'); 

class Turtle extends EventEmitter {
    constructor({ id }) {
        if (id === undefined) {
            throw new Error('Turtle id must be defined');
        }
        super();
        this.id = id;
    }
    move(direction, distance)
}