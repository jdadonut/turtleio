return function (msg, env)
    return {
        op = "ERR",
        reason = "OP 8 is deprecated and is no longer implemented, please use OP QRY.",
        uuid = msg.uuid,
    }
end 