// RPS - Multiplayer
// Rock, Paper, Scissors made using Javascript and firebase

// Initialize Firebase
 var config = {
   apiKey: "AIzaSyDTDDqqoNnWuCDCf6aQGpo_1UF5NqWE9oA",
   authDomain: "rps-multiplayer-6b3c9.firebaseapp.com",
   databaseURL: "https://rps-multiplayer-6b3c9.firebaseio.com",
   storageBucket: "rps-multiplayer-6b3c9.appspot.com",
   messagingSenderId: "944278702942"
 };
 firebase.initializeApp(config);

 var database = firebase.database();

 var players;
 var player1Name;
 var player2Name;

// Database Snapshots ////////////////////////////////////////////

// Player 1 Name Changes
database.ref('/players/1/name').on('value', function(snapshot){

    player1Name = snapshot.val();
    console.log(player1Name);
})

// Player 2 Name Changes
database.ref('/players/2/name').on('value', function(snapshot){

    player2Name = snapshot.val();
    console.log(player2Name);
})

 // Game Variables ///////////////////////////////////////////////////
 var gameStarted = false;

// Functions /////////////

function playGame(){
    // On Player Disconnect
    console.log('database ref child: ' + database.ref('/players').child(userID))
    database.ref('/players').child(userID).onDisconnect().remove()
}

// jQuery ////////////////////////////////////////////////////////////
 $(document).ready(function(){
     // jQuery Elements //////////////////////////////////////////////
     $playButton = $('#playButton');
     $nameInput = $('#nameInput');
     $addPlayerForm = $('#addPlayerForm');


     // Play Game Button
     $playButton.on('click', function(){

        // set name to value in field
        var name = $nameInput.val().trim();

        // if player1 and 2 both exist, do nothing
        if (player1Name && player2Name){
            return false;

        // if player1 exists, add player 2
        }else if (player1Name){
            console.log('adding player 2')
            userID = 2;
            console.log('user: ' + userID)
            database.ref('/players/2').update({
                name: name,
                user: userID,
                wins: 0,
                losses: 0
            });

            // disable add player form and button once players have been selected
            // $addPlayerForm.hide();
            // $playButton.hide();

        // if neither player exists, add player 1
        }else {
            console.log('adding player 1')
            userID = 1;
            console.log('user: ' + userID)
            database.ref('/players/1').update({
                name: name,
                user: userID,
                wins: 0,
                losses: 0
            })
        }
        // reset form field
        $nameInput.val("");

        playGame();
        // prevent page refresh
        return false;
    });

 }); // end of jQuery
