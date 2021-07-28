return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 6 is deprecated and is no longer implemented, please use OP CMD.",
        uuid = msg.uuid,
    }
end 