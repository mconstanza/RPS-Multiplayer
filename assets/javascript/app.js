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
 var gameStarted = false;
 var player1Choice;
 var player2Choice;
 var wins = 0;
 var turns = 0;

// Database Snapshots ////////////////////////////////////////////

var player1Data = database.ref('/players/1');
var player2Data = database.ref('/players/2');

// Player 1 Name Changes
database.ref('/players/1/name').on('value', function(snapshot){

    player1Name = snapshot.val();
    console.log(player1Name);
});

// Player 2 Name Changes
database.ref('/players/2/name').on('value', function(snapshot){

    player2Name = snapshot.val();
    console.log(player2Name);
});

 // Game Variables ///////////////////////////////////////////////////


// Functions /////////////

function displayChoice(player, choice){

    if (player == 'player1'){
        // empty the divs
        $player1Div.empty();

        switch(choice){
            case 0:
                $player1Div.append($rockImg);
                break;

            case 1:
                $player1Div.append($paperImg);
                break;

            case 2:
                $player1Div.append($scissorsImg);
                break;
        }

    }else if (player == 'player2'){
        $player2Div.empty();

        switch(choice){
            case 0:
                $player2Div.append($rockImg);
                break;

            case 1:
                $player2Div.append($paperImg);
                break;

            case 2:
                $player2Div.append($scissorsImg);
                break;

        }
    }

};

function variableReset(){

    player1Data.child('choice').remove();
    player2Data.child('choice').remove();
};

function winCheck(){
    // rock
    if (player1Choice == 0){
        switch (player2Choice){
            case 0:
                // tie game
                console.log('Tie Game!')
                //variableReset();
                break;
            case 1:
                // player 2 wins
                console.log('player 2 wins!')
                //variableReset();
                break;
            case 2:
                // player 1 wins
                console.log('player 1 wins!')
                //variableReset();
                break;
        };
    // paper
    }else if (player1Choice == 1){
            switch (player2Choice){
                case 0:
                    // player 1 wins
                    console.log('player 1 wins!')
                    //variableReset();
                    break;
                case 1:
                    // tie game
                    console.log('Tie Game!')
                    //variableReset();
                    break;
                case 2:
                    // player 2 wins
                    console.log('player 2 wins!')
                    //variableReset();
                break;
            }
    // scissors
    }else if (player1Choice == 2){
        switch (player2Choice){
            case 0:
                // player 2 wins
                console.log('player 2 wins!')
                //variableReset();
                break;
            case 1:
                // player 1 wins
                console.log('player 1 wins!')
                //variableReset();
                break;
            case 2:
                // tie game
                console.log('Tie Game!')
                //variableReset();
                break;
        }
    }
    $player1Div.show();
    $player2Div.show();
};

function playGame(){
    // hide player divs so they can't see other player's choice

    $player1Div.hide();
    $player2Div.hide();


    // Rock, paper, scissors buttons

    $rock.on('click', function(){
        database.ref('/players').child(userID).update({
            choice: 0
        });
        console.log('Rock!')
        console.log('player ' + userID + ' choice: rock')


    });

    $paper.on('click', function(){
        database.ref('/players').child(userID).update({
            choice: 1
        });
        console.log(player1Choice)


    });

    $scissors.on('click', function(){
        database.ref('/players').child(userID).update({
            choice: 2
        });

    });


    // listen for changes to player choices
    database.ref('/players/1/choice').on('value', function(snapshot){
        player1Choice = snapshot.val();
        displayChoice('player1', player1Choice);
        winCheck()
    });

    database.ref('/players/2/choice').on('value', function(snapshot){
        player2Choice = snapshot.val();
        displayChoice('player2', player2Choice);
        winCheck()
    });


    // On Player Disconnect - remove that player's data
    database.ref('/players').child(userID).onDisconnect().remove();

}

// jQuery ////////////////////////////////////////////////////////////
 $(document).ready(function(){
     // jQuery Elements //////////////////////////////////////////////
     $playButton = $('#playButton');
     $nameInput = $('#nameInput');
     $addPlayerForm = $('#addPlayerForm');

     $player1Div = $('#player1Div');
     $player2Div = $('#player2Div');

     $rock = $('#rock');
     $paper = $('#paper');
     $scissors = $('#scissors');

     $rockImg = $('<img>');
     $rockImg.attr('src', 'assets/images/rock-paper-scissors-rock-icon.png')
     $rockImg.attr('id', 'rockImg')

     $paperImg = $('<img>');
     $paperImg.attr('src', 'assets/images/rock-paper-scissors-paper-icon.png')
     $paperImg.attr('id', 'paperImg')

     $scissorsImg = $('<img>');
     $scissorsImg.attr('src', 'assets/images/rock-paper-scissors-scissors-icon.png')
     $scissorsImg.attr('id', 'scissorsImg')


     // Play Game Button
     $playButton.on('click', function(){

        gameStarted = true;

        $playButton.hide();
        $addPlayerForm.hide();
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
            });
        }
        // reset form field
        $nameInput.val("");

        playGame();
        // prevent page refresh
        return false;
    });




 }); // end of jQuery
