return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 4 is deprecated and is no longer implemented, please use OP REX.",
        uuid = msg.uuid,
    }
end 