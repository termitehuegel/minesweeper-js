const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const padding = 1;

/**
 *
 * @param {string} cname
 * @returns {string}
 */
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function drawRect(x, y, color) {
    ctx.beginPath();
    ctx.rect((game.size+padding)*x, (game.size+padding)*y, game.size, game.size);
    ctx.fillStyle = color;
    ctx.fill();
}

function getMousePos(canvas, event) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    };
}
//Function to check whether a point is inside a rectangle
function isInside(pos, rect){
    return pos.x > rect.x && pos.x < rect.x+rect.width && pos.y < rect.y+rect.height && pos.y > rect.y
}

class Game {
    isWin = false;
    isAlive = true;
    tableSize;
    bombCount;
    field = [];
    flagCount = 0;
    tileCount;
    uncoveredTileCount = 0;
    score = 0;
    hardness;
    size;
    timeStart;
    flagImg;


    constructor(hardness) {
        this.hardness = hardness;
        switch (hardness) {
            case 0:
                this.tableSize = 10;
                this.bombCount = 10;
                break;
            case 1:
                this.tableSize = 16;
                this.bombCount = 40;
                break;
            case 2:
                this.tableSize = 21;
                this.bombCount = 99;
                break;
        }

        this.size = Math.floor(600/(this.tableSize + padding));

        this.flagImg = new Image(this.size, this.size);
        this.flagImg.src = 'img/flag.png';

        this.generateField();
        this.tileCount = this.tableSize**2;
    }

    generateField() {
        for (let x = 0; x<this.tableSize; x++) {
            this.field[x] = [];
            for (let y = 0; y<this.tableSize; y++) {
                this.field[x].push({value: 0, uncovered: false, flagged: false});
            }
        }
        this.generateBombs(this.bombCount);
        this.generateNumbers();
    }

    generateNumbers() {
        for (let x = 0; x<this.tableSize; x++) {
            for (let y = 0; y<this.tableSize; y++) {
                if (this.field[x][y].value != -1) {
                    let value = 0;
                    for (let xPos = -1; xPos < 2; xPos++) {
                        for (let yPos = -1; yPos < 2; yPos++) {
                            if (x + xPos >= 0 && y + yPos >= 0 && this.field[x + xPos] != null && this.field[x + xPos][y + yPos] != null) {
                                if (this.field[x + xPos][y + yPos].value === -1) {
                                    value++;
                                }
                            }
                        }
                    }
                    this.field[x][y].value = value;
                }
            }
        }
    }

    generateBombs(count) {
        if (count <= 0) {
            return;
        }
        let yPos = Math.floor(Math.random() * this.tableSize);
        let xPos = Math.floor(Math.random() * this.tableSize);
        if (this.field[xPos][yPos].value == 0) {
            this.field[xPos][yPos].value = -1;
            this.generateBombs(count - 1);
        } else {
            this.generateBombs(count);
        }
    }

    uncoverTile(x, y) {
        if (!this.field[x][y].uncovered && !this.field[x][y].flagged) {
            if (this.uncoveredTileCount == 0) {
                this.timeStart = Date.now();
            }
            if (this.field[x][y].value == -1) {
                this.die();
            } else if (this.field[x][y].value > 0) {
                this.field[x][y].uncovered = true;
                this.uncoveredTileCount++;
            } else {
                this.field[x][y].uncovered = true;
                this.uncoveredTileCount++;
                for (let xPos = -1; xPos < 2; xPos++) {
                    for (let yPos = -1; yPos < 2; yPos++) {
                        if (x + xPos >= 0 && y + yPos >= 0 && this.field[x + xPos] != null && this.field[x + xPos][y + yPos] != null) {
                            this.uncoverTile(parseInt([x + xPos]),parseInt([y + yPos]));
                        }
                    }
                }
            }
            if (this.uncoveredTileCount == this.tileCount - this.bombCount) {
                this.win();
            }
        }
    }

    flag(x, y) {
        if (this.field[x][y].uncovered == false) {
            if (this.field[x][y].flagged) {
                this.field[x][y].flagged = false;
                this.flagCount--;
            } else if (this.flagCount < this.bombCount) {
                    this.field[x][y].flagged = true;
                    this.flagCount++;
            }
        }
    }
    win() {
        this.score = Math.floor((Date.now() - this.timeStart)/1000);
        this.isWin = true;
    }

   die() {
       this.isAlive = false;
   }
}
let game = new Game(1);

setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (game.isAlive && !game.isWin) {
        ctx.beginPath();
        ctx.rect(0, 0, Math.floor((game.size+1)*game.tableSize), Math.floor((game.size+1)*game.tableSize));
        ctx.fillStyle = '#666';
        ctx.fill();

        let coordinatesAdd = {};

        switch (game.hardness) {
            case 0:
                coordinatesAdd = {x: + 17.5, y: 40};
                ctx.font = "30px Arial";
                break;
            case 1:
                coordinatesAdd = {x: 10, y: 25};
                ctx.font = "20px Arial";
                break;
            case 2:
                coordinatesAdd = {x: + 9, y: 20};
                ctx.font = "15px Arial";
                break;
        }
        for (let x = 0; x<game.field.length; x++) {
            for (let y = 0; y<game.field.length; y++) {
                if (game.field[x][y].uncovered) {
                    drawRect(x, y, '#ddd');
                    if (game.field[x][y].value > 0) {
                        ctx.fillStyle = '#000';
                        ctx.fillText(game.field[x][y].value, x*(game.size+padding) + coordinatesAdd.x, y*(game.size+padding) + coordinatesAdd.y);
                    }
                } else if (game.field[x][y].flagged) {
                    drawRect(x, y, '#aaa');
                    ctx.drawImage(game.flagImg, x*(game.size+padding), y*(game.size+padding), game.flagImg.width, game.flagImg.height);
                } else {
                    drawRect(x, y, '#aaa');
                }
            }
        }
    } else {
        if (getCookie(game.hardness.toString()) === "" || getCookie(game.hardness.toString()) === "0") {
            document.cookie = game.hardness.toString() + '=' + game.score.toString();
        }
        if (parseInt(getCookie(game.hardness.toString())) > game.score && game.score > 0) {
            document.cookie = game.hardness.toString() + '=' + game.score.toString();
        }
        ctx.font = "20px Arial";
        if (game.isWin) {
            ctx.fillStyle = '#0c0';
            ctx.fillText("YOU WON", canvas.width / 4 + 75, canvas.height *  7/18);
        } else {
            ctx.fillStyle = '#c00';
            ctx.fillText("YOU LOST", canvas.width / 4 + 72.5, canvas.height *  7/18);
        }

        ctx.fillStyle = '#ccc';
        ctx.fillText("Easy", canvas.width/4, canvas.height*2/3);
        ctx.fillText("Medium", canvas.width/4, canvas.height*2/3 + 24 );
        ctx.fillText("Hard", canvas.width/4, canvas.height*2/3 + 48);
        ctx.fillStyle = '#000';
        ctx.fillText("Score: " + game.score + 's', canvas.width/4, canvas.height/4 + 24);
        ctx.fillText("Highscore: " + getCookie(game.hardness.toString()) + 's', canvas.width/4, canvas.height/4);

    }
}, 50);

canvas.addEventListener('click', function(evt) {

    const mousePos = getMousePos(canvas, evt);


    if (game.isAlive && !game.isWin) {
        for (let x = 0; x < game.tableSize; x++) {
            for (let y = 0; y < game.tableSize; y++) {
                if (isInside(mousePos, {x: x*(game.size+padding), y: y*(game.size+padding), width: game.size, height: game.size})) {
                    game.uncoverTile(x, y);
                }
            }
        }
    } else {
        for (let hardness = 0; hardness <= 2; hardness++) {
            if (isInside(mousePos, {x: canvas.width/4, y: canvas.height*2/3 - 20 + 24*hardness, width: 100, height: 20})) {
                game = new Game(hardness);
            }
        }
    }
}, false);

canvas.addEventListener('contextmenu', function(evt) {

    if (game.isAlive && !game.isWin) {
        const mousePos = getMousePos(canvas, evt);
        for (let x = 0; x < game.tableSize; x++) {
            for (let y = 0; y < game.tableSize; y++) {
                if (isInside(mousePos, {x: x*(game.size+padding), y: y*(game.size+padding), width: game.size, height: game.size})) {
                    game.flag(x, y);
                }
            }
        }
    }
    return false;
}, false);