json = require "./json"
io.input(io.stdin)
ws = http.websocket("3c353b863357.ngrok.io/ws");
function OP_0(msg)
    print("Registered on server with id of " .. msg.data)
    id = msg.data
    ws.send(json.encode({id = id, op = 3, ack_code = 0}))
end
function OP_1(msg)
    print("Received a heartbeat <3")
end
function OP_2(msg)
    local func = loadstring(msg.data)
    if func then
        print("Loaded function: " .. msg.data)
        local suc, res = func()
        if suc ~= nil then
            if suc then
                ws.send(json.encode({id = id, op = 3, ack_code = 2, suc = res, err = ""}))
            else
                ws.send(json.encode({id = id, op = 3, ack_code = 2, suc = res, err = res}))
            end
        end
    else
        print("Failed to load function: " .. msg.data)
    end
    ws.send(json.encode({id = id, op = 3, ack_code = 2}))
end
function OP_3(msg)
    ws.send(json.encode({id = id, op = 3, ack_code = 3}))
end
function OP_4(msg)
    local func = loadstring(msg.data)
    if func then
        func()
    else
        print("Failed to load function: " .. msg.data)
    end
    ws.send(json.encode({id = id, op = 3, ack_code = 4}))
end
function OP_8(msg)
    local fun = loadstring(msg.data)
    local yup, ydown, left, right, front, back
    local d1 , d2   , d3  , d4   , d5   , d6
    local suc, res = fun()
    print(json.encode({
        up = {
            isAir = yup,
            blockData = d1
        },
        down = {
            isAir = ydown,
            blockData = d2
        },
        left = {
            isAir = left,
            blockData = d3
        },
        right = {
            isAir = right,
            blockData = d4
        },
        front = {
            isAir = front,
            blockData = d5
        },
        back = {
            isAir = back,
            blockData = d6
        }
    }))
        ws.send(json.encode({id = id, op = 9, suc = suc, res = {
            up = {
                isAir = yup,
                blockData = d1
            },
            down = {
                isAir = ydown,
                blockData = d2
            },
            left = {
                isAir = left,
                blockData = d3
            },
            right = {
                isAir = right,
                blockData = d4
            },
            front = {
                isAir = front,
                blockData = d5
            },
            back = {
                isAir = back,
                blockData = d6
            }
        }, uuid = msg.uuid}))
end
op_tables = {
    [0] = OP_0,
    [1] = OP_1,
    [2] = OP_2,
    [3] = OP_3,
    [4] = OP_4,
    [8] = OP_8,
}

if not ws then
    print("Failed to create websocket")
else
    -- handshake
    ws.send(json.encode({id = id, op = 0}));
    while true do
        -- read message
        msg = ws.receive(10)
        -- handle message
        if msg then
            asyncDoMessageProcess(msg)
        else
            ws.send(json.encode({id = id, op = 1, data = os.clock()}))
        end
    end
end
