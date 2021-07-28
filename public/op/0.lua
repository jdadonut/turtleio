return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 0 is deprecated and is no longer implemented, please use OP IDN.",
        uuid = msg.uuid,
    }
end 