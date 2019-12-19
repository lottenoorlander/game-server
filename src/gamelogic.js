//this is just to start on the gamelogic to be placed in a router later


//when you pick a card frontend should send Array that holds [priority and turn and user]
PUT '/turn', auth, (req, res, next) => 
set user.ready to true 
and set user.move to turn

//before call movement decide by priority wich user moves first 
if (user1.ready && user2.ready) {
    check user1.turn[priority] > user2.turn[priority]
    if > 1 => movement(user1, user1.turn) .then movement(user2, user2.turn) /* check if anyone won? == if won set phase to player 1 won or player 2 won*/.then send gameroom .then set ready to false and turn to null .then set phase of gameroom to execute turn or deal card? //DOES EXECUTE TURN MAKE SENSE? MAYBE INSTEAD DO DEAL CARD AND FRONTEND DEALS WITH DISPLAY MOVES BEFORE DEAL CARD!
    else movement(user2, user2.turn) .then movement(user1, user1.turn)/* check if anyone won? == if won set phase to player 1 won or player 2 won*/ .then send gameroom .then set ready to false and turn to null .then set phase of gameroom to execute turn or deal card?

//movement will receive player and turn
function movement(user, turn){
    //what is movement and what do we do with that info
    if(turn.movement === orientation){
        find User by user.id 
        update user.orientation to turn.movement
    } else {
        find User by user.id
        if(turn.movement === up){ //position is stored as [x, y] so x is the array and y is the position in that array
         update user.position to user.position[0] - 1
        }
        if(turn.movement === down){ //position is stored as [x, y] so x is the array and y is the position in that array
         update user.position to user.position[0] + 1
        } else if (turn.movement === left){
            update user.position to user.position[1] - 1
        } else if (turn.movement === right){
            update user.position to user.position[1] + 1
        }
    //is the player still on the board?
        if(user.position[0] >= 16 || user.position[1] >= 12 ){
            user.position = user.startposition
        }

    function playerpositioncheck(currentUser, otherUser?){//after you made move, check if new position hits other player
    if(user.position === otheruserpos){
        otheruser.health - 1 && otheruser.position = otheruser.startposition
    }}

    //check if tile does anything
    const board = [[pit],[floor],[flag1],[floor]],[[],[],[],[],[], etc]
    if(board[user.position[0]][user.position[1]] === pit){ //what does pit do?
        user.health - 1 && user.position = user.startposition
    } else if(board[user.position[0]][user.position[1]] === flag){ //what does flag do?
        user.flags + 1 
    } else if(board[user.position[0]][user.position[1]] === conveyor){ //what does conveyor do?
        if(conveyor right){
            move one more right //see above movement
        } else if(conveyor etc) {
            //etc for: up left down 
        } /*QUESTION does our standard board have chained conveyor belts or conveyor belts that make you fall off the board or into a pit or into another player? because if so that would require a secondary place validation*/
    } 
    playerpositioncheck(see previous)//possible second check to see if player bumped into another player?
        
        
}

//deal card should be frontend, right? You only send the card info to the backend.

