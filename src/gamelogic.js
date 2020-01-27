//this is just to start on the gamelogic to be placed in a router later


//when you pick a card frontend should send Array that holds [priority and turn and user]
PUT '/turn', auth, (req, res, next) => 
set user.ready to true 
and set user.move to turn   ///DONE

//before call movement decide by priority wich user moves first 
if (user1.ready && user2.ready) {
    check user1.turn[priority] > user2.turn[priority]
    if > 1 => movement(user1, user1.turn) .then movement(user2, user2.turn) /* check if anyone won? OR LOST?! == if won set phase to player 1 won or player 2 won*/.then send gameroom .then set ready to false and turn to null .then set phase of gameroom to execute turn or deal card? //DOES EXECUTE TURN MAKE SENSE? MAYBE INSTEAD DO DEAL CARD AND FRONTEND DEALS WITH DISPLAY MOVES BEFORE DEAL CARD!
    else movement(user2, user2.turn) .then movement(user1, user1.turn)/* check if anyone won? OR LOST?! == if won set phase to player 1 won or player 2 won*/ .then send gameroom .then set ready to false and turn to null .then set phase of gameroom to execute turn or deal card?
//DONE


//movement will receive player and turn
function movement(user, turn){
    //what is movement and what do we do with that info
    if(turn.movement === orientation){
       
    } else {
        
        if(turn.movement === up){ //position is stored as [x, y] so x is the array and y is the position in that array
         update user.position to userY - 1
        }
        if(turn.movement === down){
            userY + 1
         //position is st=ed as [x, y] so x is the array and y is the position in that array          update user.position to user.position[0] + 1
        } else if (turn.movement === left){ //for each of these check tile for conveyor if so add one extra
            update user.position to userX - 1
        } else if (turn.movement === right){
            update user.position to userX + 1
        }
    //is the player still on the board?
        if(user.position[0] >= 16 || user.position[1] >= 12 ){
            user.position = user.startposition
        }

    function playerpositioncheck(currentUser, otherUser?){//after you made move, check if new position hits other player
    if(user.position === otheruserpos){
        otheruser.health - 1 && otheruser.position = otheruser.startposition
    }}
}

//gets the user via auth 
PUT '/start', auth, (req, res, next) => {
set user.ready to true 
if (user1.ready && user2.ready) {
    set gameroom.phase to (choose)turn
    { where gameroomId === user1.gameroomId }
}  
send back gamerooms
}
//deal card should be frontend, right? You only send the card info to the backend.

//FRONTEND [every post/put req to backend comes with jwt]
//1. ready button needs change game phase to choose turn via /start
//1a. deal 4 random cards with random priority numbers
//1b. cards need to be clickable [also change to colored outline on click?]
//2. on click needs to supply Array called "turn" that holds [priority and turn] to /turn
//3. update stats and gameboard? //I DON'T KNOW WHAT TO DO ABOUT DISPLAYING EACH PART OF THE TURN maybe skip for now
//4. needs to first display moves when gameroom.phase is deal cards and then deal the actual cards
//4a. repeat from 1a as long as there's no winner
//5. if winner or loser display the end and winner/loser depending on player