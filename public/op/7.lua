return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 7 is deprecated and is no longer implemented, please use OP ENQ.",
        uuid = msg.uuid,
    }
end 