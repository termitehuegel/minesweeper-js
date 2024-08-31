const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
const size = 50;
const padding = 5;



function  drawRect(x, y, color) {
    ctx.beginPath();
    ctx.rect((size+padding)*x, (size+padding)*y, size, size);
    ctx.fillStyle = color;
    ctx.fill();
}

class Tile {
    x;
    y;
    value;

    constructor(x, y, value) {
        this.x = x;
        this.y = y;
        this.value = value;
    }
}

class Game {
    win = false;
    score = 0;
    tileColors = {2: '#eee', 4: '#ffbb98', 8: '#ffb38a', 16: '#fc7463', 32: '#ff543c', 64: '#ff3619', 128: '#fce475', 256: '#ffe45a', 512: '#ffe344', 1024: '#ffdf1c', 2048: '#000'}
    isAlive = true;
    tiles = [];
    tableSize = 4;

    constructor() {
        this.generateCell();
        this.generateCell();
    }


    generateCell() {
        let freePositions = this.getFreePositions();
        if (freePositions.length === 0) {
            this.isAlive = false;
        } else {
            let pos = Math.floor(Math.random() * freePositions.length);
            let value = 2 ** Math.floor(Math.random() * 2 + 1);
            pos = freePositions[pos];
            this.tiles.push(new Tile(pos.x, pos.y, value));
        }
    }

    getFreePositions() {
        let freePos = [];
        for (let x = 0; x < this.tableSize; x++) {
            for (let y = 0; y < this.tableSize; y++) {
                let flag = true;
                this.tiles.forEach(function (pos) {
                    if (pos.x == x && pos.y == y) {
                        flag = false;
                    }
                });
                if (flag) {
                    freePos.push({x: x, y: y});
                }
            }
        }
        return freePos;
    }

    moveLeft() {
        let yxOrderedList = [];
        for (let y = 0; y<this.tableSize; y++) {
            let xOrderedList = [];
            for (let x = 0; x < this.tableSize; x++) {
                for (let i = 0; i < this.tiles.length; i++) {
                    if (this.tiles[i].x === x && this.tiles[i].y === y) {
                        xOrderedList.push(this.tiles[i]);
                        break;
                    }
                }
            }
            yxOrderedList.push(xOrderedList);
        }
        this.tiles = [];
        for (let j = 0; j<yxOrderedList.length; j++) {
            for (let i = 0; i<yxOrderedList[j].length; i++) {
                if (yxOrderedList[j][i + 1] != null) {
                    if (yxOrderedList[j][i].value === yxOrderedList[j][i + 1].value) {
                        yxOrderedList[j][i].value = yxOrderedList[j][i].value * 2;
                        this.score +=  yxOrderedList[j][i].value;
                        if (yxOrderedList[j][i].value === 4096) {
                            this.win = true;
                            this.isAlive = false;
                        }
                        yxOrderedList[j].splice(i + 1, 1);
                    }
                }
                yxOrderedList[j][i].x = i;
                this.tiles.push(yxOrderedList[j][i]);
            }
        }
        this.generateCell();
    }


    moveUp() {
        let xyOrderedList = [];
        for (let x = 0; x<this.tableSize; x++) {
            let yOrderedList = [];
            for (let y = 0; y < this.tableSize; y++) {
                for (let i = 0; i < this.tiles.length; i++) {
                    if (this.tiles[i].x === x && this.tiles[i].y === y) {
                        yOrderedList.push(this.tiles[i]);
                        break;
                    }
                }
            }
            xyOrderedList.push(yOrderedList);
        }
        this.tiles = [];
        for (let j = 0; j<xyOrderedList.length; j++) {
            for (let i = 0; i<xyOrderedList[j].length; i++) {
                if (xyOrderedList[j][i + 1] != null) {
                    if (xyOrderedList[j][i].value === xyOrderedList[j][i + 1].value) {
                        xyOrderedList[j][i].value = xyOrderedList[j][i].value * 2;
                        this.score +=  xyOrderedList[j][i].value;
                        if (xyOrderedList[j][i].value === 4096) {
                            this.win = true;
                            this.isAlive = false;
                        }
                        xyOrderedList[j].splice(i + 1, 1);
                    }
                }
                xyOrderedList[j][i].y = i;
                this.tiles.push(xyOrderedList[j][i]);
            }
        }
        this.generateCell();
    }

    moveRight() {
        let yxOrderedList = [];
        for (let y = 0; y<this.tableSize; y++) {
            let xOrderedList = [];
            for (let x = 0; x < this.tableSize; x++) {
                for (let i = 0; i < this.tiles.length; i++) {
                    if (this.tiles[i].x === x && this.tiles[i].y === y) {
                        xOrderedList.push(this.tiles[i]);
                        break;
                    }
                }
            }
            xOrderedList.reverse();
            yxOrderedList.push(xOrderedList);
        }
        this.tiles = [];
        for (let j = 0; j<yxOrderedList.length; j++) {
            for (let i = 0; i<yxOrderedList[j].length; i++) {
                if (yxOrderedList[j][i + 1] != null) {
                    if (yxOrderedList[j][i].value === yxOrderedList[j][i + 1].value) {
                        yxOrderedList[j][i].value = yxOrderedList[j][i].value * 2;
                        this.score +=  yxOrderedList[j][i].value;
                        if (yxOrderedList[j][i].value === 4096) {
                            this.win = true;
                            this.isAlive = false;
                        }
                        yxOrderedList[j].splice(i + 1, 1);
                    }
                }
                yxOrderedList[j][i].x = this.tableSize - 1 - i;
                this.tiles.push(yxOrderedList[j][i]);
            }
        }
        this.generateCell();
    }

    moveDown() {
        let xyOrderedList = [];
        for (let x = 0; x<this.tableSize; x++) {
            let yOrderedList = [];
            for (let y = 0; y < this.tableSize; y++) {
                for (let i = 0; i < this.tiles.length; i++) {
                    if (this.tiles[i].x === x && this.tiles[i].y === y) {
                        yOrderedList.push(this.tiles[i]);
                        break;
                    }
                }
            }
            yOrderedList.reverse();
            xyOrderedList.push(yOrderedList);
        }
        this.tiles = [];
        for (let j = 0; j<xyOrderedList.length; j++) {
            for (let i = 0; i<xyOrderedList[j].length; i++) {
                if (xyOrderedList[j][i + 1] != null) {
                    if (xyOrderedList[j][i].value === xyOrderedList[j][i + 1].value) {
                        xyOrderedList[j][i].value = xyOrderedList[j][i].value * 2;
                        this.score +=  xyOrderedList[j][i].value;
                        if (xyOrderedList[j][i].value === 4096) {
                            this.win = true;
                            this.isAlive = false;
                        }
                        xyOrderedList[j].splice(i + 1, 1);
                    }
                }
                xyOrderedList[j][i].y = this.tableSize - 1 -i;
                this.tiles.push(xyOrderedList[j][i]);
            }
        }
        this.generateCell();
    }
}

let game = new Game();

setInterval(function () {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (game.isAlive) {
        ctx.beginPath();
        ctx.rect(0, 0, 220, canvas.height);
        ctx.fillStyle = '#aaa';
        ctx.fill();
        for (let x = 0; x < game.tableSize; x++) {
            for (let y = 0; y < game.tableSize; y++) {
                drawRect(x, y, '#ccc');
            }
        }
        game.tiles.forEach(function (tile) {
            drawRect(tile.x, tile.y, game.tileColors[tile.value]);
            ctx.font = "20px Arial";
            if (tile.value !== 2048) {
                ctx.fillStyle = '#000';
            } else {
                ctx.fillStyle = '#FFF';
            }
            let xDifference = 20;

            switch (true) {
                case tile.value > 1000:
                    xDifference = 5;
                    break;
                case tile.value > 100:
                    xDifference = 10;
                    break;
                case tile.value > 10:
                    xDifference = 15;
                    break;
            }
            ctx.fillText(tile.value, tile.x*(size+padding) + xDifference, tile.y*(size+padding) + 35);
        });
        ctx.font = "20px Arial";
        ctx.fillStyle = '#000';
        ctx.fillText("Score: " + game.score, 230, 35);
    } else {
        if (document.cookie == "") {
            document.cookie = game.score.toString();
        }
        if (parseInt(document.cookie) < game.score) {
            document.cookie = game.score.toString();
        }
        ctx.font = "10px Arial";
        if (game.win) {
            ctx.fillStyle = '#0c0';
            ctx.fillText("YOU WON", canvas.width / 4 + 35, canvas.height / 2);
        } else {
            ctx.fillStyle = '#c00';
            ctx.fillText("YOU DIED", canvas.width / 4 + 35, canvas.height / 2);
        }
        ctx.fillStyle = '#ccc';
        ctx.fillText("PRESS ANY BUTTON TO RETRY", canvas.width/4, canvas.height*2/3);
        ctx.fillStyle = '#000';
        ctx.fillText("Score: " + game.score, canvas.width/4, canvas.height/4 + 12);
        ctx.fillText("Highscore: " + document.cookie, canvas.width/4, canvas.height/4);
    }
}, 50);


window.onkeydown = function (event) {
    if (game.isAlive) {
        switch (event.keyCode) {
            case 37:
                game.moveLeft();
                break;
            case 65:
                game.moveLeft();
                break;
            case 38:
                game.moveUp();
                break;
            case 87:
                game.moveUp();
                break;
            case 39:
                game.moveRight();
                break;
            case 68:
                game.moveRight();
                break;
            case 83:
                game.moveDown();
                break;
            case 40:
                game.moveDown();
                break;
        }
    } else {
        game = new Game();
    }
}
