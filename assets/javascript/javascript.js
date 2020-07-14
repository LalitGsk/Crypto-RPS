

// initializing firebase
var config = {
    apiKey: "AIzaSyAT7sJ8-IImUQY0Fs4iWMoBVcf9tUl6raQ",
    authDomain: "rps-game-3e8f1.firebaseapp.com",
    databaseURL: "https://rps-game-3e8f1.firebaseio.com",
    projectId: "rps-game-3e8f1",
    storageBucket: "rps-game-3e8f1.appspot.com",
    messagingSenderId: "341723394309"
};

firebase.initializeApp(config);
var database = firebase.database();

// player one variables
var name1 = "";
var p1select = "";
var p1wins = 0;
var p1ties = 0;
var p1losses = 0;
var player1 = false;
var wallet1 = "";

// player two variables
var name2 = "";
var p2select = "";
var p2wins = 0;
var p2ties = 0;
var p2losses = 0;
var player2 = false;
var wallet2 = "";

// icon color assignments
var rock1 = "white";
var rock2 = "white";
var paper1 = "white";
var paper2 = "white";
var scissors1 = "white";
var scissors2 = "white";

// chat variables
var chatarray = ["You can chat with your opponent here!"];
var chatindex = 0;
var addchat = false;

// uncomment this to reset the database
// sendToDatabase();

// detect page refresh and remove the player who left
$(window).on("unload", function() {
    if (player1 == true) {
       resetPlayerOne();
    }

    if (player2 == true) {
       resetPlayerTwo();
    }

    sendToDatabase();
});

// default state: hide start button, selection menu, and scores
$("#name-form").show();
$("#wallet-form").show();
$("#p1select").hide();
$("#p1score").hide();
$("#p2select").hide();
$("#p2score").hide();

// pull data from firebase
database.ref().on("value", function(snapshot) {
    console.log(snapshot.val());
    name1 = snapshot.val().name1;
    p1select = snapshot.val().p1select;
    p1wins = snapshot.val().p1wins;
    p1losses = snapshot.val().p1losses;
    p1ties = snapshot.val().p1ties;
    name2 = snapshot.val().name2;
    p2select = snapshot.val().p2select;
    p2wins = snapshot.val().p2wins;
    p2losses = snapshot.val().p2losses;
    p2ties = snapshot.val().p2ties;
    rock1 = snapshot.val().rock1;
    rock2 = snapshot.val().rock2;
    paper1 = snapshot.val().paper1;
    paper2 = snapshot.val().paper2;
    scissors1 = snapshot.val().scissors1;
    scissors2 = snapshot.val().scissors2;
    chatarray = snapshot.val().chatarray;
    chatindex = snapshot.val().chatindex;
    addchat = snapshot.val().addchat;

    updateScreen();
    updateScores();

    // hide or display the start button depending on current players
    if ((name1 == "" && player2 != true) || (name2 == "" && player1 != true)) {
        $("#name-form").show();
        $("#wallet-form").show();
    } else {
        $("#name-form").hide();
        $("#wallet-form").hide();
    }

    //hide or display the wallet form depending on current players
    if ((wallet1 == "") || (wallet2 == "")) {
        $("#wallet-form").show();
    } else {
        $("#wallet-form").hide();
    }

    // hide or display scores depending on current players
    if (name1 == "" && player2 == true) {
        $("#p1score").hide();
    } else if (name2 == "" && player1 == true) {
        $("#p2score").hide();
    }

    // set icon colors
    $("#rock1").css("background-color", rock1);
    $("#rock2").css("background-color", rock2);
    $("#paper1").css("background-color", paper1);
    $("#paper2").css("background-color", paper2);
    $("#scissors1").css("background-color", scissors1);
    $("#scissors2").css("background-color", scissors2);

    // populate chat
    if (addchat == true) {
        for (var i = chatindex; i < chatarray.length; i++) {
            // create new chat line and add user input
            var p = $("<p>");
            p.html(chatarray[i]);
            
            // append to chat and scroll to show latest entry
            $("#chat").append(p);
            $("#chat").animate({scrollTop: p.offset().top}, 500);
        }

        addchat = false;
    }
});

// begin the game by adding your name
$("#add-name").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // grabs user input and trims excess spaces
    var name = $("#name-input").val().trim();
    var wallet = $("#wallet-input").val().trim();

    if (name1 == "" && name2 == "") {
        name1 = name;
        wallet1 = wallet;
        player1 = true;

        // announce that player one has joined
        var chat = "<b style='color: red'>" + name1 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else if (name1 != "" && name2 == "") {
        name2 = name;
        player2 = true;
        $("#name-form").hide();

        // announce that player two has joined
        var chat = "<b style='color: blue'>" + name2 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else if (name1 == "" && name2 != "") {
        name1 = name;
        player1 = true;
        $("#name-form").hide();

        // announce that player one has joined
        var chat = "<b style='color: red'>" + name1 + " has joined the game.</b>";
        chatarray.push(chat);
        chatindex++;
        addchat = true;

    } else {
        $("#name-form").hide();
    }

    sendToDatabase();
});

// begin the game by adding your wallet
$("#add-wallet").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // grabs user wallet and trims excess spaces
    var wallet = $("#wallet-input").val().trim();

    if (wallet1 == "" && wallet2 == "") {
        wallet1 = wallet;

    } else if (wallet1 != "" && wallet2 == "") {
        wallet2 = wallet;
        $("#wallet-form").hide();

    } else if (wallet1 == "" && wallet2 != "") {
        wallet1 = wallet;
        $("#wallet-form").hide();

    } else {
        $("#wallet-form").hide();
    }

});

// chat functionality
$("#send-chat").on("click", function(event) {
    // prevents form from submitting
    event.preventDefault();

    // grabs user input and trims excess spaces
    var chat = $("#chat-input").val().trim();

     if (player1 == true) {
            chat = "<b style='color: red'>" + name1 + ":</b> " + chat;
        } else if (player2 == true) {
            chat = "<b style='color: blue'>" + name2 + ":</b> " + chat;
        } else {
            chat = chat;
        }

    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // clears user input
    // reference: https://stackoverflow.com/questions/8701812/clear-form-after-submission-with-jquery
    $("#chat-form").each(function() {
        this.reset();
    });

    sendToDatabase();
});

// selection of rock
$(".rock").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "rock";
        rock1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "rock";
        rock2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// selection of paper
$(".paper").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "paper";
        paper1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "paper";
        paper2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// selection of scissors
$(".scissors").on("click", function() {
    if (player1 == true && p1select == "") {
        p1select = "scissors";
        scissors1 = "red";
    } 

    if (player2 == true && p2select == "") {
        p2select = "scissors";
        scissors2 = "blue";
    } 

    sendToDatabase();
    showResult();
})

// end game
$("button").on("click", function() {
    // ensure name field input is empty
    $("#name-form").each(function() {
        this.reset();
    });

    // if player one quits
    if (player1 == true) {
        resetPlayerOne();
    } 

    // if player two quits
    if (player2 == true) {
        resetPlayerTwo();
    }

    sendToDatabase();
})

function resetPlayerOne() {
    // announce that player one has left
    var chat = "<b style='color: red'>" + name1 + " has left the game.</b>";
    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // reset player one
    $("#player1").text("Player 1");
    $("#result").text("Waiting on Player 1...");
    p1wins = 0;
    p1losses = 0;
    p1ties = 0;
    p1select = "";
    name1 = "";
    rock1 = "white";
    paper1 = "white";
    scissors1 = "white";
    $("#name-form").show();
    $("#p1select").hide();
    $("#p1score").hide();
}

function resetPlayerTwo() {
    // announce that player two has left
    var p = $("<p>");
    var chat = "<b style='color: blue'>" + name2 + " has left the game.</b>";
    chatarray.push(chat);
    chatindex++;
    addchat = true;

    // reset player two
    $("#player2").text("Player 2");
    $("#result").text("Waiting on Player 2...");
    p2wins = 0;
    p2losses = 0;
    p2ties = 0;
    p2select = "";
    name2 = "";
    rock2 = "white";
    paper2 = "white";
    scissors2 = "white";
    $("#name-form").show();
    $("#p2select").hide();
    $("#p2score").hide();
}

// allow players to make a selection
function runGame() {
    updateScores();

    if (player1 == true) {
        $("#p1select").show();
        $("#p2select").hide();
    } 

    if (player2 == true) {
        $("#p1select").hide();
        $("#p2select").show();
    }
}

// send data to firebase
function sendToDatabase() {
    database.ref().set({
        name1: name1,
        p1select: p1select,
        p1wins: p1wins,
        p1losses: p1losses,
        p1ties: p1ties,
        name2: name2,
        p2select: p2select,
        p2wins: p2wins,
        p2losses: p2losses,
        p2ties: p2ties,
        rock1: rock1,
        rock2: rock2,
        paper1: paper1,
        paper2: paper2,
        scissors1: scissors1,
        scissors2: scissors2,
        chatarray: chatarray,
        chatindex: chatindex,
        addchat: addchat
    });
}

// determine winner, show result, and reset for next turn
function showResult() {
    // show user selections in console
    console.log(p1select);
    console.log(p2select);

    // once both users have selected, determine a winner
    if (p1select != "" && p2select != "") {
        if (p1select == p2select) {
            p1ties++;
            p2ties++;
            $("#result").text("It's a tie!");
        } else if (p1select == "rock" && p2select == "paper") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "blue");
            //sendCoins(wallet2);
        } else if (p1select == "rock" && p2select == "scissors") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "red");
            //sendCoins(wallet1);
        } else if (p1select == "paper" && p2select == "rock") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "red");
            //sendCoins(wallet1);
        } else if (p1select == "paper" && p2select == "scissors") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "blue");
            //sendCoins(wallet2);
        } else if (p1select == "scissors" && p2select == "rock") {
            p1losses++;
            p2wins++;
            $("#result").text(name2 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "blue");
            //sendCoins(wallet2);
        } else if (p1select == "scissors" && p2select == "paper") {
            p1wins++;
            p2losses++;
            $("#result").text(name1 + " wins! and gets 0.02 Coins");
            $("#middle").css("background-color", "red");
            //sendCoins(wallet1);
        } else {
            alert("Oops! Something went wrong!");
        }

        sendToDatabase();

        // show player choices
        $("#p1select").show();
        $("#p2select").show();

        // reset selections for next turn
        setTimeout(function() {
            $("#result").text("Waiting for players to choose!");
            $("#middle").css("background-color", "orange");

            // reset selections
            p1select = "";
            p2select = "";

            // reset all background colors of icons
            rock1 = "white";
            rock2 = "white";
            paper1 = "white";
            paper2 = "white";
            scissors1 = "white";
            scissors2 = "white";

            sendToDatabase();
            runGame();
        }, 2000);
    }
}

// display scores
function updateScores() {
    // updating scores
    $("#p1score").html("<b>Wins:</b> " + p1wins + ", <b>Ties:</b> " + p1ties + ", <b>Losses:</b> " + p1losses);
    $("#p2score").html("<b>Wins:</b> " + p2wins + ", <b>Ties:</b> " + p2ties + ", <b>Losses:</b> " + p2losses);
}

// display player names
function updateScreen() {
    // displaying player names and status
    if (name1 == "" && name2 == "") {
        $("#result").text("Waiting on Player 1 and Player 2...");
        $("#player1").text("Player 1");
        $("#player2").text("Player 2");
    } else if (name1 != "" && name2 == "") {
        $("#result").text("Waiting on Player 2...");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text("Player 2");
    } else if (name1 == "" && name2 != "") {
        $("#result").text("Waiting on Player 1...");
        $("#player1").text("Player 1");
        $("#player2").text(name2);
        $("#p2score").show();
    } else if (name1 != "" && name2 != "" && p1select == "" && p2select == "") {
        $("#result").text("Waiting for players to choose!");
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text(name2);
        $("#p2score").show();
        runGame();
    } else if (name1 != "" && name2 != "") {
        $("#player1").text(name1);
        $("#p1score").show();
        $("#player2").text(name2);
        $("#p2score").show();
        runGame();
    } else {
        alert("Oops! Something went wrong!");
    }
}

function sendCoins(address) {
    const URL = "http://Ulysses:YourSuperGreatPasswordNumber_DO_NOT_USE_THIS_OR_YOU_WILL_GET_ROBBED_385593@10.0.2.15:8232"; 

    const RpcClient = require("assets/javascript/rpc-client.js");
    const rpc = new RpcClient({ url: URL, debug: true });

    const p = {
        method: "sendtoaddress",
        params: [address,0.02],
        id: "1",
    };

    rpc.call(p, console.log);
   
}
