local json = require "./json"

local event_loop = require("./events")
Queue = require("./queue")()
local ws = http.websocket("3c353b863357.ngrok.io/ws");


if not ws then
    print("Failed to create websocket")
else
    -- handshake
    ws.send(json.encode({id = id, op = 0}));
    coroutine.create(make_event_loop)
    while true do
        -- read message
        local msg = ws.receive(10)
        -- handle message
        if msg then
            -- handle message
            Queue.pushright(json.decode(msg))
        else
            ws.send(json.encode({id = id, op = 1, data = os.clock()}))
        end
    end
end
function make_event_loop()
    event_loop({
        queue = Queue,
        ws = ws,
        id = id,
        json = json,
        event_handlers = {
            [0] = require "./op/0.lua",
            [1] = require "./op/1.lua",
            [2] = require "./op/2.lua",
            [3] = require "./op/3.lua",
            [4] = require "./op/4.lua",
            [5] = require "./op/5.lua",
            [6] = require "./op/6.lua",
            [7] = require "./op/7.lua",
            [8] = require "./op/8.lua",
            [9] = require "./op/9.lua",
            [10] = require "./op/10.lua",
            ["IDT"] = require "./op/IDT.lua",
            ["HRB"] = require "./op/HRB.lua",
            ["CMD"] = require "./op/CMD.lua",
            ["ACK"] = require "./op/ACK.lua",
            ["ERR"] = require "./op/ERR.lua",
            ["REX"] = require "./op/REX.lua",
            ["ENQ"] = require "./op/ENQ.lua",
            ["QRY"] = require "./op/QRY.lua",

        }
    })
end