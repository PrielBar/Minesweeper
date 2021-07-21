const MINE = '💣'
const EMPTY = '';
const FLAG = '🚩'
var gBoard;
//  minesAroundCount: 4,
 isShown = true,
 isMine =false,
 isMarked = true



//  gLevel = {
//     SIZE: 4,
//     MINES: 2
//    }; 

function initGame() {
    gBoard = buildBoard();
    renderBoard(gBoard);
}

function buildBoard(size) {
    var board = [];
    for (var i = 0; i < size; i++) {
        board[i] = [];
        for (var j = 0; j < size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: true
            };
        }
    } return board;
}  

    function renderBoard(board, selector) {
        var strHTML = '';
        for (var i = 0; i < board.length; i++) {
            strHTML += `<tr>\n`;
            for (var j = 0; j < board[0].length; j++) {
                var cell = board[i][j];
                var cellContant = (cell.isMine) ? MINE : cell.minesAroundCount;
                if (cellContant === 0) cellContant = '';
                var className = `cell cell-${i}-${j} covered`;
                strHTML += `<td class="${className}" onmousedown="checkClickType(this, ${i}, ${j}, event)" ></td>\n`
            }
            strHTML += '</tr>'
        }
        console.log('strHTML', strHTML)
    
        var elContainer = document.querySelector('.' + selector);
        elContainer.innerHTML = strHTML;
    }

// checkGameOver() 
function gameOver() {
    if (isWin()) {
        console.log('you win');
        changeSmiley('😎')
    } else {
        console.log('you lose');
        changeSmiley('😪');
    }
    clearInterval(gameInter);
    gGame.isOn = false;
}
// setMinesNegsCount() 
// cellClicked()

// gGame = {
//     isOn: false,
//     shownCount: 0,
//     markedCount: 0,
//     secsPassed: 0
//    }

function chooseLevel(level) {
    if (elCheck.value === '16') gSize = 16;
    else if (elCheck.value === '25') gSize = 25;
    else gSize = 36;

}

function renderTimer() {
    var currentTime = new Date();
    var timeElapsed = new Date(currentTime - gTimeBegan);
    var sec = timeElapsed.getUTCSeconds();
    var ms = timeElapsed.getUTCMilliseconds();
    var timerHTML = (sec > 9 ? sec : "0" + sec) + "." +
        (ms > 99 ? ms : ms > 9 ? "0" + ms : "00" + ms);
    document.querySelector('.timer').innerHTML = timerHTML
}


