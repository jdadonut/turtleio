const { ack } = require("./util.js");

const uuid = require("node-uuid");
function client_handshake(ws, message) {
}

function client_heartbeat(ws, message) {
    ws.send(JSON.stringify({op: 1}));
}

function client_message(ws, message) {
}

function client_ack(ws, message) {
}

function client_execute(ws, message, queues) {
    if (queues[message.id] === undefined) {
        ws.send(JSON.stringify({op: 5, error: "Turtle does not exist"}));
        return;
    }
    queues[message.id].enqueue(message.data);
    ws.send(ack(4));
}

function client_err(ws, message) {
}

function client_command(ws, message, queues) {
    if (queues[message.id] === undefined) {
        ws.send(JSON.stringify({op: 5, error: "Turtle does not exist"}));
        return;
    }
    queues[message.id].enqueue(processCommand(message));
    ws.send(JSON.stringify({op: 7}));
}
function client_query(ws, message, queues, callbacks) {
    console.log(`OPCODE 8 BEGIN`)
    if (queues[message.id] === undefined) {
        console.log(`OPCODE 8 ERR: TURTLE DOESNT EXIST`);
        ws.send(JSON.stringify({op: 5, error: "Turtle does not exist"}));
        return;
    }
    let _uuid = uuid.v4()
    let _callback = (res_msg) => {
        console.log(`OPCODE 8 NFO: _callback CALLED`)
        ws.send(JSON.stringify({op: 8, id: message.id, data: res_msg}));
    }
    callbacks.set(_uuid, _callback);
    queues[message.id].enqueue(processCommand({command: {name: "query"}}), {op: 8, uuid:_uuid});
    ws.send(JSON.stringify({op: 7}));
}
function processCommand(message) {
  let command = message.command;
  if (command.name == "clear") {
    return "shell.run('clear')";
  } else if (command.name == "move") {
    if (!command.args.length > 0) {
      return "print('Invalid command: Invalid argmuents')";
    }
    switch (command.args[0]) {
      case "up":
        return "return turtle.up()";
      case "down":
        return "return turtle.down()";
      case "left":
        return "turtle.turnLeft();a, b = turtle.forward();turtle.turnRight(); return a,b";
      case "right":
        return "turtle.turnRight();a, b = turtle.forward();turtle.turnLeft(); return a,b";
      case "forward":
        return "return turtle.forward()";
      case "backward":
        return "return turtle.back()";
      default:
        return "print('Invalid command: Invalid arguments')";
    }
  } else if (command.name == "query") {
    return `
        yup, d1 = turtle.inspectUp();
        ydown, d2 = turtle.inspectDown();
        front, d5 = turtle.inspect();
        turtle.turnLeft();
        left, d3 = turtle.inspect();
        turtle.turnLeft();
        back, d5 = turtle.inspect();
        turtle.turnLeft();
        right, d4 = turtle.inspect();
        turtle.turnLeft();`;
  }
}


module.exports = {
    client_handshake: client_handshake,
    client_heartbeat: client_heartbeat,
    client_message: client_message,
    client_ack: client_ack,
    client_execute: client_execute,
    client_err: client_err,
    client_command: client_command,
    client_query: client_query
};
