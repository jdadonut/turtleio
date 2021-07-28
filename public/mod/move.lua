function moveLeft()
    turnLeft()
    moveForward()
    turnRight()
end
function moveRight()
    turnRight()
    moveForward()
    turnLeft()
end
function moveUp()
    turtle.up()
end
function moveDown()
    turtle.down()
end
function moveForward()
    turtle.forward()
end
function moveBackward()
    turtle.back()
end
function turnLeft()
    turtle.turnLeft()
end
function turnRight()
    turtle.turnRight()
end
return moveLeft, moveRight, moveUp, moveDown, moveForward, moveBackward, turnLeft, turnRight;