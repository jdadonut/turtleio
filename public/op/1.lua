return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 1 is deprecated and is no longer implemented, please use OP HRB.",
        uuid = msg.uuid,
    }
end 