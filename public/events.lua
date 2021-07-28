

local function event_loop(env)
    while true do
        ProcessEvent(env)
    end
end

function ProcessEvent(env)
    local event = env.queue.popleft();
    if not event then return end -- no event, break
    local event_op = event.op;
    local event_call = env.event_handlers[event_op];
    if not event_call then
        print("event: " .. event_op .. " not handled")
        return
    end
    local event_args = event.args;
    local event_ret = event_call(event_args);
    if event_ret then
        if event_ret.op then
            return env.ws.send(json.encode(event_ret))
        end
        return env.ws.send(env.json.encode({op = "ACK", uuid = event.uuid, returning_op = event_op}))
    else
        return env.ws.send(env.json.encode({op = "ACK", uuid = event.uuid, returning_op = event_op}))
    end
end
return event_loop
