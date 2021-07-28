function ack(op) {
    return JSON.stringify({ op: 3, ack_code: op });
  }

module.exports = {ack: ack};