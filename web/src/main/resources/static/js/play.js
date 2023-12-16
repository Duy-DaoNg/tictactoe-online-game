const clientId = getCookie("username")
console.log(clientId)
var opponentID = ""
var roomId = "none"
const IDLE = 1
const WAITING = 2
const CHOOSE = 3
const NOTIFY = 4
const WAIT_RESTART = 5
const SECRET_KEY = '0123456789abcdef';
const INIT_VECTOR = 'abcdef0123456789';
var exit_result_ongoing = true
var time_out
function getCookie(cookieName) {
    const name = cookieName + "=";
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}
function encrypt(text) {
    try {
        const textEncoder = new TextEncoder();
        const encodedText = textEncoder.encode(text);

        const keyBuffer = new TextEncoder().encode(SECRET_KEY);
        const ivBuffer = new TextEncoder().encode(INIT_VECTOR);

        return crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
        true, ["encrypt"]
        ).then((key) => crypto.subtle.encrypt(
            { name: "AES-CBC", iv: ivBuffer },
            key,
            encodedText
        )).then((encryptedBuffer) => {
            const encryptedArray = Array.from(new Uint8Array(encryptedBuffer));
            return btoa(String.fromCharCode(...encryptedArray));
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

function decrypt(encryptedText) {
//    return encryptedText;
    try {
        const encryptedArray = new Uint8Array(atob(encryptedText).split("").map((c) => c.charCodeAt(0)));

        const keyBuffer = new TextEncoder().encode(SECRET_KEY);
        const ivBuffer = new TextEncoder().encode(INIT_VECTOR);

        return crypto.subtle.importKey(
            "raw",
            keyBuffer,
            { name: "AES-CBC" },
            true, ["decrypt"]
        ).then((key) => crypto.subtle.decrypt(
            { name: "AES-CBC", iv: ivBuffer },
            key,
            encryptedArray
        )).then((decryptedBuffer) => {
            const textDecoder = new TextDecoder();
            return textDecoder.decode(decryptedBuffer);
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

var state = IDLE
console.log(clientId)
const host = 'wss://06cc6c19611745ce805a4ae16024bc92.s2.eu.hivemq.cloud:8884/mqtt'
const disMessage = {
    operation: "disconnect",
    senderId: clientId,
    roomId: roomId
}
var options = "";
var client  = "";

//encrypt(JSON.stringify(disMessage)).then((disconnectMessage) => {
    options = {
        username: 'user1',
        password: 'User1234',
        keepalive: 60,
        clientId: clientId,
        protocolId: 'MQTT',
        protocolVersion: 4,
        clean: true,
        reconnectPeriod: 1000,
        connectTimeout: 30 * 1000,
        will: {
            topic: 'my/test/topic',
            payload: JSON.stringify(disMessage),
            qos: 0,
            retain: false
        },
    }
    time = 0;
    client = mqtt.connect(host, options)
    client.on('error', function (error) {
        console.log(error);
    });
    client.on('message', function (topic, message) {
        // called each time a message is received
        console.log('Received message:', topic, message.toString());


//        var message = decrypt(message).then(message => {
//            console.log('Decrypt message:', topic, message.toString());

            const response = JSON.parse(message.toString())
            // need to check if message was sent to me

            if (validMessage(response) == true) {
                if (state == WAITING) {
                    console.log("Check waiting")
                    console.log(response.operation)
                    console.log(response.operation == "match-found")
                    if (response.operation == "match-found") {
                        clearInterval(myInterval)
                        
                        state = CHOOSE
                        roomId = response.roomId
                        if (response.currentPlayer == clientId) {
                            opponentID = response.secondId;
                            player = x;
                            computer = o;
                            whoseTurn = player;
                            playerText = xText;
                            computerText = oText;

                        }
                        else {
                            opponentID = response.currentPlayer;
                            player = o;
                            computer = x;
                            whoseTurn = computer;
                            playerText = oText;
                            computerText = xText;
                        }
                        document.getElementById("op").innerHTML = opponentID
                        document.getElementById("optionsDlg").style.display = "none"
                    }
                }
                else if (state == CHOOSE) {
                    // Check opponentID
                    if (response.operation == "choose") {
                        if (whoseTurn == computer)
                            console.log(response.value)
                            makeComputerMove(response.value)
                    }
                    if (response.operation == "match") {
                        whoseTurn = response.currentPlayer == clientId ? player:computer;
                    }
                    if (response.operation == "result") {
                        exit_result_ongoing = false
                        checkWin();
                    }
                    if (response.operation == "result-error") {
                        // announceWinner("Your opponent has surrendered");
                        exit_result_ongoing = false
                        setTimeout(restartGame(true, true), 1000);
                    }
                    if (response.operation == "exit-player") {
                        exit_result_ongoing = false
                        announceWinner("Your opponent has surrendered");
                        setTimeout(restartGame(true, true), 100);
                    }
                }
                else if (state == WAIT_RESTART) {
                    if (response.operation == "match") {
                        state = CHOOSE
                        setTimeout(closeModal, 1, "winAnnounce");
                        clearTimeout(time_out);
                        whoseTurn = response.currentPlayer == clientId ? player:computer;
                    }
                }
            }
        });
//    });
    client.subscribe('my/test/topic');
//})





// TODO: valid message
const validMessage = (response) => {
    if (state == CHOOSE) {
        if (response.operation == "choose") {
            if (response.roomId != roomId) return false
        }
        else if (response.operation == "match") {
            if (response.roomId != roomId) return false
        }
        else if (response.operation == "result") {
            if (response.roomId != roomId)
            return false
        }
        else if (response.operation == "result-error") {
            if (response.roomId != roomId && response.winnerId != clientId)
            return false
        }
        else if (response.operation == "exit-player") {
            if (response.roomId != roomId && response.winnerId != clientId)
            return false
        }
    }
    else if (state == WAITING) {
        if (response.operation == "match-found") {
            if (response.currentPlayer != clientId && response.secondId != clientId )
                return false
        }
    }
    else if (state == WAIT_RESTART) {
        if (response.operation == "match") {
            if (response.roomId != roomId) return false
        }
    }
    return true
}


// subscribe to topic 'my/test/topic'



const gameStart = () => {
    if (state == IDLE) {
        var message = {
            operation: "start",
            senderId: clientId,
        }
//        encrypt(JSON.stringify(message)).then(message => {
            client.publish('my/test/topic', JSON.stringify(message));
            state = WAITING
//        })
        
    } 
    document.getElementById("okBtn").style.display = "none";
    document.getElementById("historyBtn").style.display = "none";
    document.getElementById("ask").style.display = "none";
    document.getElementById("waiting").style.display = "block";
    time = 0
    myInterval = setInterval(upTime, 1000)
}

function upTime() {
    time++
    document.getElementById("count-time").innerHTML = time
}


"use strict";

document.onkeypress = function (evt) {
    evt = evt || window.event;
    var modal = document.getElementsByClassName("modal")[0];
    if (evt.keyCode === 27) {
        modal.style.display = "none";
    }
};

// When the user clicks anywhere outside of the modal dialog, close it
window.onclick = function (evt) {
    var modal = document.getElementsByClassName("modal")[0];
    if (evt.target === modal) {
        modal.style.display = "none";
    }
};

//==================================
// HELPER FUNCTIONS
//==================================
function sumArray(array) {
    var sum = 0,
        i = 0;
    for (i = 0; i < array.length; i++) {
        sum += array[i];
    }
    return sum;
}

function isInArray(element, array) {
    if (array.indexOf(element) > -1) {
        return true;
    }
    return false;
}

function shuffleArray(array) {
    var counter = array.length,
        temp,
        index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
}

function intRandom(min, max) {
    var rand = min + Math.random() * (max + 1 - min);
    return Math.floor(rand);
}

// GLOBAL VARIABLES
var moves = 0,
    winner = 0,
    x = 1,
    o = 3,
    player = x,
    computer = o,
    whoseTurn = x,
    gameOver = false,
    score = {
        ties: 0,
        player: 0,
        computer: 0
    },
    xText = "<span class=\"x\">&times;</class>",
    oText = "<span class=\"o\">o</class>",
    playerText = xText,
    computerText = oText,
    difficulty = 1,
    myGrid = null;

//==================================
// GRID OBJECT
//==================================

// Grid constructor
//=================
function Grid() {
    this.cells = new Array(9);
}

// Grid methods
//=============

// Get free cells in an array.
// Returns an array of indices in the original Grid.cells array, not the values
// of the array elements.
// Their values can be accessed as Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
    var i = 0,
        resultArray = [];
    for (i = 0; i < this.cells.length; i++) {
        if (this.cells[i] === 0) {
            resultArray.push(i);
        }
    }
    // console.log("resultArray: " + resultArray.toString());
    // debugger;
    return resultArray;
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns the values of the elements.
Grid.prototype.getRowValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowValues!");
        return undefined;
    }
    var i = index * 3;
    return this.cells.slice(i, i + 3);
};

// Get a row (accepts 0, 1, or 2 as argument).
// Returns an array with the indices, not their values.
Grid.prototype.getRowIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getRowIndices!");
        return undefined;
    }
    var row = [];
    index = index * 3;
    row.push(index);
    row.push(index + 1);
    row.push(index + 2);
    return row;
};

// get a column (values)
Grid.prototype.getColumnValues = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getColumnValues!");
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(this.cells[i]);
    }
    return column;
};

// get a column (indices)
Grid.prototype.getColumnIndices = function (index) {
    if (index !== 0 && index !== 1 && index !== 2) {
        console.error("Wrong arg for getColumnIndices!");
        return undefined;
    }
    var i, column = [];
    for (i = index; i < this.cells.length; i += 3) {
        column.push(i);
    }
    return column;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagValues = function (arg) {
    var cells = [];
    if (arg !== 1 && arg !== 0) {
        console.error("Wrong arg for getDiagValues!");
        return undefined;
    } else if (arg === 0) {
        cells.push(this.cells[0]);
        cells.push(this.cells[4]);
        cells.push(this.cells[8]);
    } else {
        cells.push(this.cells[2]);
        cells.push(this.cells[4]);
        cells.push(this.cells[6]);
    }
    return cells;
};

// get diagonal cells
// arg 0: from top-left
// arg 1: from top-right
Grid.prototype.getDiagIndices = function (arg) {
    if (arg !== 1 && arg !== 0) {
        console.error("Wrong arg for getDiagIndices!");
        return undefined;
    } else if (arg === 0) {
        return [0, 4, 8];
    } else {
        return [2, 4, 6];
    }
};

// Get first index with two in a row (accepts computer or player as argument)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
    if (agent !== computer && agent !== player) {
        console.error("Function getFirstWithTwoInARow accepts only player or computer as argument.");
        return undefined;
    }
    var sum = agent * 2,
        freeCells = shuffleArray(this.getFreeCellIndices());
    for (var i = 0; i < freeCells.length; i++) {
        for (var j = 0; j < 3; j++) {
            var rowV = this.getRowValues(j);
            var rowI = this.getRowIndices(j);
            var colV = this.getColumnValues(j);
            var colI = this.getColumnIndices(j);
            if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
                return freeCells[i];
            } else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
                return freeCells[i];
            }
        }
        for (j = 0; j < 2; j++) {
            var diagV = this.getDiagValues(j);
            var diagI = this.getDiagIndices(j);
            if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
                return freeCells[i];
            }
        }
    }
    return false;
};

Grid.prototype.reset = function () {
    for (var i = 0; i < this.cells.length; i++) {
        this.cells[i] = 0;
    }
    return true;
};

//==================================
// MAIN FUNCTIONS
//==================================

// executed when the page loads
function initialize() {
    myGrid = new Grid();
    moves = 0;
    winner = 0;
    gameOver = false;
    whoseTurn = player; // default, this may change
    for (var i = 0; i <= myGrid.cells.length - 1; i++) {
        myGrid.cells[i] = 0;
    }
    // setTimeout(assignRoles, 500);
    setTimeout(showOptions, 500);
    // debugger;
}

// Ask player if they want to play as X or O. X goes first.
function assignRoles() {
    askUser("Do you want to go first?");
    document.getElementById("yesBtn").addEventListener("click", makePlayerX);
    document.getElementById("noBtn").addEventListener("click", makePlayerO);
}

function makePlayerX() {
    player = x;
    computer = o;
    whoseTurn = player;
    playerText = xText;
    computerText = oText;
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

function makePlayerO() {
    player = o;
    computer = x;
    whoseTurn = computer;
    playerText = oText;
    computerText = xText;
    setTimeout(makeComputerMove, 400);
    document.getElementById("userFeedback").style.display = "none";
    document.getElementById("yesBtn").removeEventListener("click", makePlayerX);
    document.getElementById("noBtn").removeEventListener("click", makePlayerO);
}

// executed when player clicks one of the table cells
function cellClicked(id) {
    // The last character of the id corresponds to the numeric index in Grid.cells:
    if (whoseTurn != player) return false
    var idName = id.toString();
    var cell = parseInt(idName[idName.length - 1]);
    if (myGrid.cells[cell] > 0 || whoseTurn !== player || gameOver) {
        // cell is already occupied or something else is wrong
        return false;
    }
    moves += 1;
    document.getElementById(id).innerHTML = playerText;
    // randomize orientation (for looks only)
    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    document.getElementById(id).style.cursor = "default";
    myGrid.cells[cell] = player;
    var message = {
        operation: 'choose',
        roomId: roomId,
        senderId: clientId,
        value: cell.toString()
    }
//    encrypt(JSON.stringify(message)).then(message => {
        client.publish('my/test/topic', JSON.stringify(message));
//    })

    // Test if we have a winner:
    if (moves >= 5) {
        winner = checkWin();
    }
    if (winner === 0) {
        whoseTurn = computer;
        // makeComputerMove();
    }
    return true;
}

// Executed when player hits restart button.
// ask should be true if we should ask users if they want to play as X or O
function exitGame(ask) {
    if(exit_result_ongoing === false) return; 
    if (moves >= 0) {
        var response = confirm("Are you sure you want to start over?");
        if (response === false) {
            return;
        }
    }
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;
    myGrid.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    
    var message = {
        operation: "exit",
        roomId: roomId,
        senderId: clientId
    }

    if (ask === true) {
        state = IDLE
        // setTimeout(assignRoles, 200);
        document.getElementById("okBtn").style.display = "inline-block";
        document.getElementById("historyBtn").style.display = "inline-block";
        document.getElementById("ask").style.display = "block";
        document.getElementById("waiting").style.display = "none";
        setTimeout(showOptions, 200);
//        encrypt(JSON.stringify(message)).then(message => {
            client.publish('my/test/topic', JSON.stringify(message));
//        })
    }
}
function toIdle(){
    setTimeout(closeModal, 1, "winAnnounce");
    exit_result_ongoing = true
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = computer;
    myGrid.reset();
    state = IDLE
    document.getElementById("computer_score").innerHTML = 0;
    document.getElementById("tie_score").innerHTML = 0;
    document.getElementById("player_score").innerHTML = 0;
    // setTimeout(assignRoles, 200);
    document.getElementById("okBtn").style.display = "inline-block";
    document.getElementById("historyBtn").style.display = "inline-block";
    document.getElementById("ask").style.display = "block";
    document.getElementById("waiting").style.display = "none";
    setTimeout(showOptions, 200);
    return;
}
function restartGame(ask, error) {
    
    if (state == WAIT_RESTART) {
        time_out = setTimeout(toIdle,5000);
        exit_result_ongoing = true
        gameOver = false;
        moves = 0;
        winner = 0;
        whoseTurn = computer;
        myGrid.reset();
        for (var i = 0; i <= 8; i++) {
            var id = "cell" + i.toString();
            document.getElementById(id).innerHTML = "";
            document.getElementById(id).style.cursor = "pointer";
            document.getElementById(id).classList.remove("win-color");
        }
        return;
    }
    if (moves > 0 && error != true) {
        
        var response = confirm("Are you sure you want to start over?");
        if (response === false) {
            return;
        }
    } else if(error == true){
        exit_result_ongoing = true
        gameOver = false;
        moves = 0;
        winner = 0;
        whoseTurn = x;
        myGrid.reset();
        // var response = confirm("Your opponent has surrendered");
        state = IDLE
        document.getElementById("computer_score").innerHTML = 0;
        document.getElementById("tie_score").innerHTML = 0;
        document.getElementById("player_score").innerHTML = 0;
        // setTimeout(assignRoles, 200);
        document.getElementById("okBtn").style.display = "inline-block";
        document.getElementById("historyBtn").style.display = "inline-block";
        document.getElementById("ask").style.display = "block";
        document.getElementById("waiting").style.display = "none";
        setTimeout(showOptions, 1);
        return;
    }
    exit_result_ongoing = true
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = x;
    // state = IDLE
    myGrid.reset();
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    
    
    
    if (ask === true) {
        
        state = IDLE
        // setTimeout(assignRoles, 200);
        document.getElementById("okBtn").style.display = "inline-block";
        document.getElementById("historyBtn").style.display = "inline-block";
        document.getElementById("ask").style.display = "block";
        document.getElementById("waiting").style.display = "none";
        setTimeout(showOptions, 200);
    }
}

// The core logic of the game AI:
function makeComputerMove( cell) {
    // debugger;
    if (whoseTurn != computer) return false
    if (gameOver) {
        return false;
    }
    if (myGrid.cells[cell] != 0) return false 
    console.log(cell)
    var id = "cell" + cell;
    // console.log("computer chooses " + id);
    document.getElementById(id).innerHTML = computerText;
    document.getElementById(id).style.cursor = "default";
    // randomize rotation of marks on the board to make them look
    // as if they were handwritten
    var rand = Math.random();
    if (rand < 0.3) {
        document.getElementById(id).style.transform = "rotate(180deg)";
    } else if (rand > 0.6) {
        document.getElementById(id).style.transform = "rotate(90deg)";
    }
    myGrid.cells[cell] = computer;

}

// Check if the game is over and determine winner
function checkWin() {
    winner = 0;

    // rows
    for (var i = 0; i <= 2; i++) {
        var row = myGrid.getRowValues(i);
        if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
            if (row[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGrid.getRowIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // columns
    for (i = 0; i <= 2; i++) {
        var col = myGrid.getColumnValues(i);
        if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
            if (col[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGrid.getColumnIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // diagonals
    for (i = 0; i <= 1; i++) {
        var diagonal = myGrid.getDiagValues(i);
        if (diagonal[0] > 0 && diagonal[0] == diagonal[1] && diagonal[0] == diagonal[2]) {
            if (diagonal[0] == computer) {
                score.computer++;
                winner = computer;
                // console.log("computer wins");
            } else {
                score.player++;
                winner = player;
                // console.log("player wins");
            }
            // Give the winning row/column/diagonal a different bg-color
            var tmpAr = myGrid.getDiagIndices(i);
            for (var j = 0; j < tmpAr.length; j++) {
                var str = "cell" + tmpAr[j];
                document.getElementById(str).classList.add("win-color");
            }
            setTimeout(endGame, 1000, winner);
            return winner;
        }
    }

    // If we haven't returned a winner by now, if the board is full, it's a tie
    var myArr = myGrid.getFreeCellIndices();
    if (myArr.length === 0) {
        winner = 10;
        score.ties++;
        endGame(winner);
        return winner;
    }

    return winner;
}

function announceWinner(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    setTimeout(closeModal, 1500, "winAnnounce");
}
function announceWaiting(text) {
    document.getElementById("winText").innerHTML = text;
    document.getElementById("winAnnounce").style.display = "block";
    // setTimeout(closeModal, 3000, "winAnnounce");
}
function askUser(text) {
    document.getElementById("questionText").innerHTML = text;
    document.getElementById("userFeedback").style.display = "block";
}

function showOptions() {
    document.getElementById("optionsDlg").style.display = "block";
}

function closeModal(id) {
    document.getElementById(id).style.display = "none";
}

function endGame(who) {
    // if (who == player) {
    //     announceWinner("Congratulations, you won!");
    // } else if (who == computer) {
    //     announceWinner(opponentID +" won!");
    // } else {
    //     announceWinner("It's a tie!");
    // }
    gameOver = true;
    whoseTurn = 0;
    moves = 0;
    winner = 0;
    state = WAITING
    document.getElementById("computer_score").innerHTML = score.computer;
    document.getElementById("tie_score").innerHTML = score.ties;
    document.getElementById("player_score").innerHTML = score.player;
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).style.cursor = "default";
    }
    var cont = confirm("Do you want to play again?")
    if (cont) {
        var message = {
            operation: "restart",
            roomId: roomId,
            senderId: clientId
        }
//        encrypt(JSON.stringify(message)).then(message => {
            client.publish('my/test/topic', JSON.stringify(message));
//        })

        state = WAIT_RESTART
        announceWaiting("Wait for your opponent restart")
        setTimeout(restartGame, 300);
    } else {
        setTimeout(exit_restart, 1);
    }
}
function exit_restart() {
    gameOver = false;
    moves = 0;
    winner = 0;
    whoseTurn = computer;
    myGrid.reset();
    state = IDLE
    document.getElementById("computer_score").innerHTML = 0;
    document.getElementById("tie_score").innerHTML = 0;
    document.getElementById("player_score").innerHTML = 0;
    for (var i = 0; i <= 8; i++) {
        var id = "cell" + i.toString();
        document.getElementById(id).innerHTML = "";
        document.getElementById(id).style.cursor = "pointer";
        document.getElementById(id).classList.remove("win-color");
    }
    document.getElementById("okBtn").style.display = "inline-block";
        document.getElementById("historyBtn").style.display = "inline-block";
        document.getElementById("ask").style.display = "block";
        document.getElementById("waiting").style.display = "none";
        setTimeout(showOptions, 200);
    var message = {
        operation: "stop",
        roomId: roomId,
        senderId: clientId
    }
//    encrypt(JSON.stringify(message)).then(message => {
        client.publish('my/test/topic', JSON.stringify(message));
//    })
}
function toHistory() {
    window.location.href = "./history";
}
window.addEventListener('beforeunload', function (e) {
    // Your custom logic here
    var message = {
            operation: "disconnect",
            roomId: roomId,
            senderId: clientId
        }
//        encrypt(JSON.stringify(message)).then(message => {
            client.publish('my/test/topic', JSON.stringify(message));
//        })
});
function terminateStart() {
    var message = {
        operation: "disconnect",
        roomId: roomId,
        senderId: clientId
    }
//    encrypt(JSON.stringify(message)).then(message => {
        client.publish('my/test/topic', JSON.stringify(message));
//    })
    gameOver = false;
        moves = 0;
        winner = 0;
        whoseTurn = computer;
        myGrid.reset();
        state = IDLE
        clearInterval(myInterval);
        time = 0;
        for (var i = 0; i <= 8; i++) {
            var id = "cell" + i.toString();
            document.getElementById(id).innerHTML = "";
            document.getElementById(id).style.cursor = "pointer";
            document.getElementById(id).classList.remove("win-color");
        }
        document.getElementById("computer_score").innerHTML = 0;
        document.getElementById("tie_score").innerHTML = 0;
        document.getElementById("player_score").innerHTML = 0;
        document.getElementById("okBtn").style.display = "inline-block";
            document.getElementById("historyBtn").style.display = "inline-block";
            document.getElementById("ask").style.display = "block";
            document.getElementById("waiting").style.display = "none";
            setTimeout(showOptions, 1);
}