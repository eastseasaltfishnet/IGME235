

document.addEventListener("DOMContentLoaded", function () {
    // 1
    const numCols = 70;
    const numRows = 40;
    const cellWidth = 10;
    const cellSpacing = 1;

    // 2
    const container = document.querySelector("#gridContainer");

    // 3
    const span = document.createElement('span');
    span.className = 'cell';

    // 4
    const cells = [];

    // 5
    for (let row = 0; row < numRows; row++) {
        cells.push([]);
        for (let col = 0; col < numCols; col++) {
            let cell = span.cloneNode();
            cell.style.left = `${col * (cellWidth + cellSpacing)}px`;
            cell.style.top = `${row * (cellWidth + cellSpacing)}px`;
            container.appendChild(cell);
            cells[row][col] = cell;
        }
    }

    // 6
    let color = "red";

    // 7
    container.onclick = fillCell;

    // 8
    function fillCell(e) {
        let rect = container.getBoundingClientRect();
        let mouseX = e.clientX - rect.left;
        let mouseY = e.clientY - rect.top;
        let columnWidth = cellWidth + cellSpacing;
        let col = Math.floor(mouseX / columnWidth);
        let row = Math.floor(mouseY / columnWidth);
        let selectedCell = cells[row][col];
        selectedCell.className = 'cellSelected';
        selectedCell.style.backgroundColor = color;
        console.log(`${col},${row}`);
    }

    // 9
    let mouseIsDown = false;

    // 10
    container.onmousemove = (e) => {
        e.preventDefault();
        if (mouseIsDown) fillCell(e);
    };

    // 11
    container.onmousedown = (e) => {
        e.preventDefault();
        mouseIsDown = true;
    };

    // 12
    window.onmouseup = (e) => {
        e.preventDefault();
        mouseIsDown = false;
    };

    // 13
    document.querySelector("#colorChooser").onchange = (e) => {
        color = e.target.value;
    };


    // Life Stuff

    // 1
    let lastUpdate = performance.now();

    // 2
    let lastFrame = performance.now();

    // 3
    let maxFrameDelay = 1000 / 12;

    // 4
    lifeworld.init(numCols, numRows);

    // 5
    loop(performance.now());

    // 6
    function loop(timestamp) {
        requestAnimationFrame(loop);
        lastUpdate = timestamp;
        if (timestamp - lastFrame > maxFrameDelay) {
            lastFrame = timestamp;
            lifeworld.step();
            updateGrid();
        }
    }

    // 7
    function updateGrid() {
        for (let row = 0; row < numRows; row++) {
            for (let col = 0; col < numCols; col++) {
                let element = cells[row][col];
                if (lifeworld.world[row][col] == 1) {
                    element.style.backgroundColor = "red";
                } else {
                    element.style.backgroundColor = "white";
                }
            }
        }
    }

});

///////////////////////////////////////////////////////////////////////////

const lifeworld = {
    init(numCols, numRows) {
        this.numCols = numCols;
        this.numRows = numRows;
        this.world = this.buildArray();
        this.worldBuffer = this.buildArray();
        this.randomSetup();
    },

    buildArray() {
        let outerArray = [];
        for (let row = 0; row < this.numRows; row++) {
            let innerArray = [];
            for (let col = 0; col < this.numCols; col++) {
                innerArray.push(0);
            }
            outerArray.push(innerArray);
        }
        return outerArray;
    },

    randomSetup() {
        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {
                this.world[row][col] = 0;
                if (Math.random() < 0.5) {
                    this.world[row][col] = 1;
                }
            }
        }

        
    },

    getLivingNeighbors(row, col) {
        // TODO:
        // row and col should > than 0, if not return 0
        let count = 0;
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {


                if (r === 0 && c === 0) {
                    continue;
                }

                let newRow = row + r;
                let newCol = col + c;
                // row and col should be < the length of the applicable array, minus 1. If not return 0
                if (newRow >= 0 &&
                    newRow < this.numRows &&
                    newCol >= 0 &&
                    newCol < this.numCols) {
                    // count up how many neighbors are alive at N,NE,E,SE,S,SW,W,SE - use this.world[row][col-1] etc
                    count += this.world[newRow][newCol];
                }
            }
        }
         // return that sum
         return count;

    },

    step() {
        // TODO:

        this.worldBuffer = this.buildArray();

        // nested for loop will call getLivingNeighbors() on each cell in this.world

        for (let row = 0; row < this.numRows; row++) {
            for (let col = 0; col < this.numCols; col++) {

                let livingNeighbors = this.getLivingNeighbors(row, col);
                let currentState = this.world[row][col];
                // Determine if that cell in the next generation should be alive (see wikipedia life page linked at top)
                if (currentState === 1) {
                    //dead
                    if (livingNeighbors < 2 || livingNeighbors > 3) {
                        this.worldBuffer[row][col] = 0;
                    }
                    else {
                        //alive
                        this.worldBuffer[row][col] = 1;
                    }
                }
                //if the cell dead already
                else {
                    if (livingNeighbors === 3) {
                        //reborn
                        this.worldBuffer[row][col] = 1;
                    } else {
                        //dead
                        this.worldBuffer[row][col] = 0;
                    }
                }


            }
        }

        // Put a 1 or zero into the right location in this.worldBuffer
        // when the looping is done, swap .world and .worldBuffer (use a temp variable to do so)

        let temp = this.world;
        this.world = this.worldBuffer;
        this.worldBuffer = temp;
    }
};

