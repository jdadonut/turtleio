return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 3 is deprecated and is no longer implemented, please use OP ACK.",
        uuid = msg.uuid,
    }
end 