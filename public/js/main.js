// {"op": 6, "id":0, "command": {"name": "move", "args": ["forward"]}}
let webSocket = new WebSocket("wss://3c353b863357.ngrok.io/panel");
let disabled_ops = [1];
$(document).ready(function () {
  setTimeout(function () {
    $("body").addClass("loaded");
    $("#form").submit(function (e) {
      e.preventDefault();
      processForm(e);
    });
  }, 3000);
  setInterval(function () {
    webSocket.send(JSON.stringify({ op: 1 }));
  }, 10000);
});

function sendPayload(payload) {
  webSocket.send(JSON.stringify(payload));
  updateQuery(payload);
}
function moveTurtle(direction) {
  sendPayload({
    op: 6,
    id: Number($("#turtleid").val()),
    command: { name: "move", args: [direction] },
  });
}
webSocket.onmessage = function (event) {
  processMessage(event);
};

function processMessage(event) {
  try {
    let data = JSON.parse(event.data);
    switch (data.op) {
      case 1:
        setMessage("Server sent a heartbeat <3", data.op);
        break;
      case 2:
        break;
      case 3:
        setMessage("Command Acknowledged", data.op);
        break;
      case 4:
        setMessage("Recieved RCE command, this shouldn't happen", data.op);
        break;
      case 5:
        setMessage("Command failed, error: " + data.error, data.op);
        break;
      case 6:
        setMessage("Recieved turtle command, this shouldn't happen", data.op);
        break;
      case 7:
        setMessage("Command(s) was enqueued", data.op);
        break;
      case 8:
        // setMessage("Recieved block query response", data.op);
        break;
      case 9:
        setMessage("Recieved block query response", data.op);
        updateButtons(data);
        break;
      default:
        setMessage("Unknown message type", data.op);
        console.log(data);
        break;
    }
  } catch (e) {
    console.log(e);
  }
}
$("#move-left").click(function () {
  moveTurtle("left");
});
$("#move-right").click(function () {
  moveTurtle("right");
});
$("#move-forward").click(function () {
  moveTurtle("forward");
});
$("#move-backward").click(function () {
  moveTurtle("back");
});
$("#move-up").click(function () {
  moveTurtle("up");
});
$("#move-down").click(function () {
  moveTurtle("down");
});
function setMessage(message, op) {
  if (disabled_ops.indexOf(op) > -1) {
    return;
  }
  $("#messages").append("<p>" + message + "</p>");
}
function updateQuery(payload) {
  if (payload?.command?.name == "move") {
    querySurroundingBlocks(payload.id);
  }
}
function querySurroundingBlocks(id) {
  sendPayload({ op: 8, id: id });
}
function updateButtons(payload) {
  if (!payload["y+1"].isAir) {
    if ($("#move-up")[0].classList.contains("btn-filled-blue")) {
      let moveup = $("#move-up")[0];
      moveup.removeClass("btn-filled-blue");
      moveup.addClass("btn-filled-red");
      moveup.innerHtml = "mine up";
    }
  } else if ($("#move-up")[0].classList.contains("btn-filled-red")) {
    let moveup = $("#move-up")[0];
    moveup.removeClass("btn-filled-red");
    moveup.addClass("btn-filled-blue");
    moveup.innerHtml = "go up";
  }
  if (!payload["y-1"].isAir) {
    if ($("#move-down")[0].classList.contains("btn-filled-blue")) {
      let movedown = $("#move-down")[0];
      movedown.removeClass("btn-filled-blue");
      movedown.addClass("btn-filled-red");
      movedown.innerHtml = "mine down";
    }
  } else if ($("#move-down")[0].classList.contains("btn-filled-red")) {
    let movedown = $("#move-down")[0];
    movedown.removeClass("btn-filled-red");
    movedown.addClass("btn-filled-blue");
    movedown.innerHtml = "go down";
  }
  if (!payload["left"].isAir) {
    if ($("#move-left")[0].classList.contains("btn-filled-blue")) {
      let moveright = $("#move-left")[0];
      moveright.removeClass("btn-filled-blue");
      moveright.addClass("btn-filled-red");
      moveright.innerHtml = "mine\n‹";
    }
  } else if ($("#move-left")[0].classList.contains("btn-filled-red")) {
    let moveright = $("#move-left")[0];
    moveright.removeClass("btn-filled-red");
    moveright.addClass("btn-filled-blue");
    moveright.innerHtml = "‹";
  }
  if (!payload["right"].isAir) {
    if ($("#move-right")[0].classList.contains("btn-filled-blue")) {
      let moveright = $("#move-right")[0];
      moveright.removeClass("btn-filled-blue");
      moveright.addClass("btn-filled-red");
      moveright.innerHtml = "mine\n›";
    }
  } else if ($("#move-right")[0].classList.contains("btn-filled-red")) {
    let moveright = $("#move-right")[0];
    moveright.removeClass("btn-filled-red");
    moveright.addClass("btn-filled-blue");
    moveright.innerHtml = "›";
  }
  if (!payload["forward"].isAir) {
    if ($("#move-forward")[0].classList.contains("btn-filled-blue")) {
      let moveright = $("#move-forward")[0];
      moveright.removeClass("btn-filled-blue");
      moveright.addClass("btn-filled-red");
      moveright.innerHtml = "mine\n⌃";
    }
  } else if ($("#move-forward")[0].classList.contains("btn-filled-red")) {
    let moveright = $("#move-forward")[0];
    moveright.removeClass("btn-filled-red");
    moveright.addClass("btn-filled-blue");
    moveright.innerHtml = "⌃";
  }
  if (!payload["back"].isAir) {
    if ($("#move-backward")[0].classList.contains("btn-filled-blue")) {
      let moveright = $("#move-backward")[0];
      moveright.removeClass("btn-filled-blue");
      moveright.addClass("btn-filled-red");
      moveright.innerHtml = "mine\n⌄";
    }
  } else if ($("#move-backward")[0].classList.contains("btn-filled-red")) {
    let moveright = $("#move-backward")[0];
    moveright.removeClass("btn-filled-red");
    moveright.addClass("btn-filled-blue");
    moveright.innerHtml = "⌄";
  }
}
