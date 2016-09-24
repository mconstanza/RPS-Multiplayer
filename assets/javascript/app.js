// RPS - Multiplayer
// Rock, Paper, Scissors made using Javascript and firebase

// jQuery ////////////////////////////////////////////////////////////
$(document).ready(function(){
    // jQuery Elements //////////////////////////////////////////////
    var $playButton = $('#playButton');
    var $nameInput = $('#nameInput');
    var $addPlayerForm = $('#addPlayerForm');

    // Chat
    var $chatDisplay = $('#chatDisplay');
    var $chatInput = $('#chatInput');
    var $chatButton = $('#chatButton');


    // Player Displays

    var $player1InfoDiv = $('#player1Info');
    var $player2InfoDiv = $('#player2Info');

    var $player1Choice = $('#player1Choice');
    var $player2Choice = $('#player2Choice');

    var $player1Name = $('#player1Name');
    var $player2Name = $('#player2Name');

    var $rock = $('#rock');
    var $paper = $('#paper');
    var $scissors = $('#scissors');

    var $rockImg = $('<img>');
    $rockImg.attr('src', 'assets/images/rock-paper-scissors-rock-icon.png')
    $rockImg.attr('id', 'rockImg')

    var $paperImg = $('<img>');
    $paperImg.attr('src', 'assets/images/rock-paper-scissors-paper-icon.png')
    $paperImg.attr('id', 'paperImg')

    var $scissorsImg = $('<img>');
    $scissorsImg.attr('src', 'assets/images/rock-paper-scissors-scissors-icon.png')
    $scissorsImg.attr('id', 'scissorsImg')

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

    // Player Objects

    var newPlayer = {
        name: "Waiting for player",
        wins: 0,
        losses: 0,
        choice: 'undefined',
        joinState: false,
        turnState: false
    };

    console.log(newPlayer)

    var player1 = newPlayer;
    var player2 = newPlayer;

    console.log(player1)

    var turns = 0;
    var userID = 0;

    // Database Snapshots ////////////////////////////////////////////

    var player1Data = database.ref('/players/1');
    var player2Data = database.ref('/players/2');


    // set player names to 'waiting for player' until players are added

    database.ref('/players/1/joinState').once('value').then(function(snapshot){
    
            player1joinState = snapshot.val();

            }).then( function() {

                database.ref('/players/2/joinState').once('value').then(function(snapshot){
                    player2joinState = snapshot.val();

                    // if player1 and 2 both exist, do nothing
                }).then( function() {
                    if (player1joinState == true && player2joinState == true){
                        return false;

                    // if player1 exists, add player 2
                    }else if (player1joinState == true){
                        userID = 2;
                        player2Data.set(newPlayer);
                        
                    // if neither player exists, add player 1
                    }else {
                       console.log('setting data')
                       console.log(newPlayer)
                       userID = 1;
                       player1Data.set(newPlayer);
                       player2Data.set(newPlayer);

                    }
                });
            });
    

    // Player 1 Name Change Listener
    database.ref('/players/1/name').on('value', function(snapshot){

        player1.name = snapshot.val();

        // write to player1Info div
        $player1Name.text(player1.name)
    });

    // Player 2 Name Change Listener
    database.ref('/players/2/name').on('value', function(snapshot){

        player2.name = snapshot.val();

        // write to player2Info div
        $player2Name.text(player2.name)
    });

    // database.ref('/players/1/').on('value', function(snapshot) {
    //     player1 = snapshot.val();
    // });

    // database.ref('/players/2/').on('value', function(snapshot) {
    //     player2 = snapshot.val();
    // });

    // Turn State Listeners - Checks if both players have taken turns and then checks if someone one

    database.ref('/players/1/turnState').on('value', function(snapshot){

        var player1TurnState = snapshot.val();

        var player2TurnState = database.ref('/players/2/turnState').once('value', function(snapshot){
            return snapshot.val();
        });

        if (player1TurnState == true && player2TurnState == true) {
            winCheck();
        }
    });

     database.ref('/players/2/turnState').on('value', function(snapshot){

        var player2TurnState = snapshot.val();

        var player1TurnState = database.ref('/players/1/turnState').once('value', function(snapshot){
            return snapshot.val();
        });

        if (player1TurnState == true && player2TurnState == true) {
            winCheck();
        }
    });


    // Functions /////////////

    function displayChoice(player, choice){

        if (player == 'player1'){
            // empty the divs
            $player1Choice.empty();

            switch(choice){
                case 0:
                    $player1Choice.append($rockImg);

                    break;

                case 1:
                    $player1Choice.append($paperImg);

                    break;

                case 2:
                    $player1Choice.append($scissorsImg);

                    break;
            }

        }else if (player == 'player2'){
            $player2Choice.empty();

            switch(choice){
                case 0:
                    $player2Choice.append($rockImg);
                    break;

                case 1:
                    $player2Choice.append($paperImg);
                    break;

                case 2:
                    $player2Choice.append($scissorsImg);
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
        if (player1.choice == 0){
            switch (player2.choice){
                case 0:
                    // tie game
                    $player1Choice.show();
                    $player2Choice.show();
                    console.log('Tie Game!')
                    //variableReset();
                    break;
                case 1:
                    // player 2 wins
                    $player1Choice.show();
                    $player2Choice.show();
                    player2Data.child('wins').transaction(function(wins){
                        return wins + 1;
                    })
                    player1Data.child('losses').transaction(function(losses){
                        return losses + 1;
                    })
                    console.log('player 2 wins!')
                    //variableReset();
                    break;
                case 2:
                    // player 1 wins
                    $player1Choice.show();
                    $player2Choice.show();
                    console.log('player 1 wins!')
                    //variableReset();
                    break;
            };
        // paper
        }else if (player1Choice == 1){
                switch (player2Choice){
                    case 0:
                        // player 1 wins
                        $player1Choice.show();
                        $player2Choice.show();
                        console.log('player 1 wins!')
                        //variableReset();
                        break;
                    case 1:
                        // tie game
                        $player1Choice.show();
                        $player2Choice.show();
                        console.log('Tie Game!')
                        //variableReset();
                        break;
                    case 2:
                        // player 2 wins
                        $player1Choice.show();
                        $player2Choice.show();
                        console.log('player 2 wins!')
                        //variableReset();
                    break;
                }
        // scissors
        }else if (player1Choice == 2){
            switch (player2Choice){
                case 0:
                    // player 2 wins
                    $player1Choice.show();
                    $player2Choice.show();
                    console.log('player 2 wins!')
                    //variableReset();
                    break;
                case 1:
                    // player 1 wins
                    $player1Choice.show();
                    $player2Choice.show();
                    console.log('player 1 wins!')
                    //variableReset();
                    break;
                case 2:
                    // tie game
                    $player1Choice.show();
                    $player2Choice.show();
                    console.log('Tie Game!')
                    //variableReset();
                    break;
            }
        }
    };

    function playGame(){
        // hide player divs so they can't see other player's choice

        $player1Choice.hide();
        $player2Choice.hide();

        // Rock, paper, scissors buttons

        $rock.on('click', function(){
            database.ref('/players').child(userID).update({
                choice: 0
            });
        });

        $paper.on('click', function(){
            database.ref('/players').child(userID).update({
                choice: 1
            });
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
            if (userID == 1){
                $player1Choice.show();
            }
           
        });

        database.ref('/players/2/choice').on('value', function(snapshot){
            player2Choice = snapshot.val();
            displayChoice('player2', player2Choice);
            if (userID == 2){
                $player2Choice.show();
            }
          
        });


        // On Player Disconnect - remove that player's data
        database.ref('/players/').child(userID).onDisconnect().set(newPlayer);
    }

     // Play Game Button
    $playButton.on('click', function(){

        $playButton.hide();
        $addPlayerForm.hide();

        // set name to value in field
        var name = $nameInput.val().trim();
        playerName = name;

        // check if players have joined the game via database

        var player1joinState;
        var player2joinState;
        
        database.ref('/players/1/joinState').once('value').then(function(snapshot){
    
            player1joinState = snapshot.val();

            }).then( function() {

                database.ref('/players/2/joinState').once('value').then(function(snapshot){
                    player2joinState = snapshot.val();

                    // if player1 and 2 both exist, do nothing
                }).then( function() {
                    console.log('in last function. player 1 ' + player1joinState + ' ' + player2joinState)

                    if (player1joinState == true && player2joinState == true){
                    return false;

                    // if player1 exists, add player 2
                    }else if (player1joinState == true){
                        console.log('adding player 2')
                        userID = 2;
                        console.log('user: ' + userID)
                        database.ref('/players/2').update({
                            name: playerName,
                            joinState: true
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
                            name: playerName,
                            joinState: true
                        });
                    }
                });
            });
        
        
        // reset form field
        $nameInput.val("");

        playGame();
        // prevent page refresh
        return false;
    });


    // Chat
    database.ref('/players/1/chat').on('child_added', function(snapshot){

        $chatDisplay.append('<br>' + snapshot.val().message);

    })

    database.ref('/players/2/chat').on('child_added', function(snapshot){

        $chatDisplay.append('<br>' + snapshot.val().message);

    })

    // Chat Submit
    $chatButton.on('click', function(){

        var input = $chatInput.val().trim();

        var message = playerName + ': ' + input

        database.ref('/players/').child(userID).child('chat').push({

            message: message
        });

        $chatInput.val('');

    })


 }); // end of jQuery
