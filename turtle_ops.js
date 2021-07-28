function turtle_handshake(ws, message) {
}

function turtle_heartbeat(ws, message) {
    console.log(`Turtle ${message.id} just sent a heartbeat <3`);
    ws.send(JSON.stringify({ op: 1 }));
}

function turtle_message(ws, message) {
}

function turtle_ack(ws, message) {
    if (message.suc !== null && message.suc !== undefined) {
        if (!message.suc) {
          console.log(
            `Turtle ${message.id} failed operation ${message.ack_code}, reason: ${message.res} (suc = ${message.suc})`
          );
        } else {
          console.log(`Turtle ${message.id} succeeded operation ${message.ack_code}`);
        }
      } else {
        console.log(`Turtle ${message.id} acknowledged operation ${message.ack_code}`);
      }
      console.log(message);
}

function turtle_execute(ws, message) {
}

function turtle_err(ws, message) {
}

function turtle_command(ws, message) {
}
function turtle_query(ws, message, callbacks) {
    ws.send(ack(9))
    if (message.uuid !== undefined) {
        callbacks.get(message.uuid)(message);
    } else {
        console.log(`Turtle ${message.id} sent a query response without a uuid, this means the client isn't getting info it needs.`);
    }
}

module.exports = {
    turtle_handshake: turtle_handshake,
    turtle_heartbeat: turtle_heartbeat,
    turtle_message: turtle_message,
    turtle_ack: turtle_ack,
    turtle_execute: turtle_execute,
    turtle_err: turtle_err,
    turtle_command: turtle_command,
    turtle_query: turtle_query
};
