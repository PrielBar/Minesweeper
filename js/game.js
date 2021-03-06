const MINE = '๐ฃ'
const EMPTY = '';
const FLAG = '๐ฉ'

var gameInter;
var gBoard;

var gLevel = {
    size: 4,
    mine: 2
}
var gMineLocations;
var gGame = {
    isOn: false,
    firstClick: false,
    shownCount: 0,
    markedCount: 0,
}

function initGame() {
    gBoard = buildBoard();

    renderBoard(gBoard);
    var elMineCounter = document.querySelector('.mines-counter span');
    elMineCounter.innerText = gLevel.mine;
}

function chooseLevel(elBtn) {
    if (elBtn.classList[0] === 'Beginner') setLevel(4, 2);
    if (elBtn.classList[0] === 'Intermediate') setLevel(8, 12);
    if (elBtn.classList[0] === 'Expert') setLevel(12, 30);
}

function setLevel(size, mine) {
    gLevel.size = size;
    gLevel.mine = mine;
    restartGame();
}

function restartGame() {
    changeSmiley('๐คจ');
    resetCounters();
    initGame();
    clearInterval(gameInter);
    updateTimer('00:00:00');
}

function resetCounters() {
    gGame.shownCount = 0;
    gGame.markedCount = 0;
    gGame.isOn = false;
    gGame.firstClick = false;
    updateTimer('00:00:00');
}

function onFirstClick(cellI, cellJ) {
    gGame.firstClick = true;
    gGame.isOn = true;
    setTimer();
    placeMines(cellI, cellJ)
    buildBoard();
    renderBoard(gBoard);

}

function placeMines(cellI, cellJ) {
    gMineLocations = getMineLocations(cellI, cellJ);
    console.log(gMineLocations, 'before');
    for (var i = 0; i < gMineLocations.length; i++) {
        var currLocation = gMineLocations[i];
        var cell = gBoard[currLocation.i][currLocation.j]
        cell.isMine = true;
    }
}

function buildBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board.push([]);
        for (var j = 0; j < gLevel.size; j++) {
            var cell = createCell();
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(mat) {
    var strHTML = '<table border="1"><tbody>\n';
    for (var i = 0; i < mat.length; i++) {
        strHTML += '\t<tr>\n';
        for (var j = 0; j < mat[0].length; j++) {
            var cell = mat[i][j];

            if (gGame.firstClick) setMinesNegsCount(i, j, mat);

            var className = `"cell cell${i}-${j}`;
            if (cell.isMine) {
                cell = MINE;
                className += ' mine';
            } else if (cell.minesAroundCount) cell = cell.minesAroundCount;
            else cell = '';
            strHTML += `\t<td class=${className}" onclick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})"><div class="hide">${cell}</div></td>\n`
        }
        strHTML += '\t</tr>\n'
    }
    strHTML += '</tbody></table>';
    var elGameBoard = document.querySelector(".game-board");
    elGameBoard.innerHTML = strHTML;
}

function isWin() {
    var totalCount = gGame.shownCount + gGame.markedCount;
    return (totalCount === gLevel.size ** 2);
}

function changeSmiley(smiley) {
    var elSmiley = document.querySelector('.smiley');
    elSmiley.innerText = smiley;
}

function gameOver() {
    if (gGame.markedCount > gLevel.mine) {
        return;
    } else if (isWin()) {
        changeSmiley('๐คฉ')
        clearInterval(gameInter);
    } else {
        changeSmiley('๐ฅ');
        clearInterval(gameInter);
        revealMines();
    }
}

function revealMines() {
    var elMines = document.querySelectorAll('.mine');
    for (var i = 0; i < elMines.length; i++) {
        var currMine = elMines[i];
        currMine.style.backgroundColor = 'red';
        currMine.querySelector('div').classList.remove('hide');
    }
}

function cellMarked(elCell, i, j) {
    if (!gGame.firstClick) onFirstClick();

    document.addEventListener('contextmenu', event => event.preventDefault());
    var cell = gBoard[i][j];

    if (cell.isShown) return;
    if (!cell.isMarked) {
        gGame.markedCount++;
        cell.isMarked = true;
        renderCell({ i, j }, FLAG);
    } else {
        gGame.markedCount--;
        cell.isMarked = false;
        renderCell({ i, j }, `<div class="hide">${cell.minesAroundCount}</div>`);
    }
    if (isWin()) gameOver();
}

function cellClicked(elCell, i, j) {
    var cell = gBoard[i][j];
    if (!gGame.firstClick) onFirstClick(i, j);
    if (!gGame.isOn) return;

    if (cell.isMarked || cell.isShown) return;
    if (cell.isMine) {
        gameOver();
        gGame.isOn = false;
    } else if (cell.minesAroundCount === 0) {
        openNegCells(i, j, gBoard);
    }

    cell.isShown = true;
    gGame.shownCount++;
    removeHide({ i, j });

    if (isWin()) gameOver();
}

function createCell() {
    return {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false
    }
}

function getMineLocations(cellI, cellJ) {
    var mineLocations = [];
    while (mineLocations.length < gLevel.mine) {
        var randI = getRandomIntInclusive(0, gLevel.size - 1)
        var randJ = getRandomIntInclusive(0, gLevel.size - 1)
        var mineLocation = { i: randI, j: randJ }
        if (!isMineLocationExsits(mineLocations, mineLocation) && !(randI === cellI && randJ === cellJ)) mineLocations.push(mineLocation);
    }
    return mineLocations;
}

function isMineLocationExsits(locations, location) {
    for (var idx = 0; idx < locations.length; idx++) {
        if (locations[idx].i === location.i && locations[idx].j === location.j) return true;
    }
    return false;
}

function setMinesNegsCount(cellI, cellJ, mat) {
    var cell = mat[cellI][cellJ];
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var currNeg = mat[i][j];
            if (currNeg.isMine) cell.minesAroundCount++;
        }
    }
}

function updateTimer(timeDiffStr) {
    var elTimer = document.querySelector('.timer span');
    elTimer.innerText = timeDiffStr;
}

function setTimer() {
    var time1 = Date.now();
    gameInter = setInterval(function () {
        var time2 = Date.now(time1);
        var msTimeDiff = time2 - time1;
        var timeDiffStr = new Date(msTimeDiff).toISOString().slice(14, -2);
        updateTimer(timeDiffStr);
    }, 100);
}

function renderCell(location, value) {
    var elCell = document.querySelector(`.cell${location.i}-${location.j}`);
    elCell.innerHTML = value;
}

function openNegCells(cellI, cellJ, mat) {
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = gBoard[i][j];
            var cellLocation = { i, j };
            if (!cell.isShown) gGame.shownCount++;
            cell.isShown = true;
            removeHide(cellLocation)
        }
    }

}

function removeHide(location) {
    gBoard[location.i][location.j].isShown = true;
    var currCell = document.querySelector(`.cell${location.i}-${location.j}`);
    currCell.querySelector('div').classList.remove('hide');
    currCell.style.backgroundColor = 'rgb(210, 210, 210)';
}
