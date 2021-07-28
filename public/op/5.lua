return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 5 is deprecated and is no longer implemented, please use OP ERR.",
        uuid = msg.uuid,
    }
end 