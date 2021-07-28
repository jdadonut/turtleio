const app = require("express")();
const express = require("express");
var expressWs = require("express-ws")(app);
const { join } = require("path");
const { Queue } = require("./entities/queue.js");
const {
  client_handshake,
  client_heartbeat,
  client_message,
  client_ack,
  client_execute,
  client_err,
  client_command,
  client_query,
} = require("./client_ops.js");
const {
  turtle_handshake,
  turtle_heartbeat,
  turtle_message,
  turtle_ack,
  turtle_execute,
  turtle_err,
  turtle_command,
  turtle_query
} = require("./turtle_ops.js");

let queues = Object.create(null);
let callbacks = new Map();

app.use(express.static(join(__dirname, "public")));

app.ws("/ws", function (ws, req) {
  let id = Object.keys(queues).length;
  console.log(`Registering turtle with id ${id}`);
  registerTurtle(id, ws);
  ws.send(JSON.stringify({ op: 0, data: id }));
  ws.on("message", function (message) {processTurtleMessage(message, ws);});
  ws.on("close", function () {
    console.log(`Turtle with id ${id} has closed connection.`);
  });
});
app.get("/panel", function (req, res) {
  res.sendFile(join(__dirname, "public", "index.html"));
});
app.ws("/panel", function (ws, req) {
  console.log("Client connected...");
  ws.on("message", function (message) {
    processClientMessage(message, ws);
  });
  ws.on("close", function () {
    console.log("Client disconnected.");
  });
});
function registerTurtle(id, ws) {
    queues[id] = new Queue();
    queues[id].on("enqueue", (_) => {
        let value = queues[id].dequeue();
        if (value.op !== undefined) {
            return ws.send(JSON.stringify({ op: value.op, data: value }));
        }
        return ws.send(JSON.stringify({ op: 4, data: value }));
    });
}


console.log(`Panel ready:  http://3c353b863357.ngrok.io/panel`);
console.log("Startup lua:  http://3c353b863357.ngrok.io/start.lua");
app.listen(8080);
function processClientMessage(message, ws) {
  try {
    message = JSON.parse(message);
  } catch (e) {
    if (message == "close") {
      ws.close();
      return;
    }
    return;
  }
  if (typeof message == "Array") {
    message.forEach((m) => processClientMessage(JSON.stringify(m), ws));
  }
  switch (message.op) {
    case 0:
      client_handshake(ws, message.data);
      break;
    case 1:
      client_heartbeat(ws, message);
      break;
    case 2:
      client_message(ws, message);
      break;
    case 3:
      client_ack(ws, message);
      break;
    case 4:
      client_execute(ws, message, queues);
      break;
    case 5:
      client_err(ws, message);
      break;
    case 6:
      client_command(ws, message, queues);
      break;
    case 8:
      client_query(ws, message, queues, callbacks);
      break;
    default:
        break;
  }
}
function processTurtleMessage(message, ws) {
    try {
      message = JSON.parse(message);
    } catch (e) {
      if (message == "close") {
        ws.close();
        return;
      }
      return;
    }
    if (typeof message == "Array") {
      message.forEach((m) => processTurtleMessage(JSON.stringify(m), ws));
    }
    switch (message.op) {
      case 0:
        turtle_handshake(ws, message.data);
        break;
      case 1:
        turtle_heartbeat(ws, message);
        break;
      case 2:
        turtle_message(ws, message);
        break;
      case 3:
        turtle_ack(ws, message);
        break;
      case 4:
        turtle_execute(ws, message);
        break;
      case 5:
        turtle_err(ws, message);
        break;
      case 6:
        turtle_command(ws, message);
        break;
      case 9:
        turtle_query(ws, message, callbacks);
        break;
    }
  }
  
  
