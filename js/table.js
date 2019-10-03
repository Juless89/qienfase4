class Board {
    constructor(x, y, players){
        // board size
        this.x = x;
        this.y = y;

        // player array
        this.players = players;

        // local storage 
        this.current_player = localStorage.getItem('current') ? JSON.parse(localStorage.getItem('current')) : 0
        this.arr = localStorage.getItem('state') ? JSON.parse(localStorage.getItem('state')) : Array.from(Array(this.x), () => new Array(this.y));

        // init local storage and set current player
        this.update_local_storage();
        this.set_current_player();

        // event listener reset button
        $("#reset").click(function() {
            board.reset(board);
        });
    }

    // reset local storage, reload board
    reset(board){
        this.current_player = 0
        this.arr = Array.from(Array(this.x), () => new Array(this.y));
        this.update_local_storage();
        this.generate_table(board);
        this.set_current_player();
    }

    // update local storage
    update_local_storage(){
        localStorage.setItem('state', JSON.stringify(this.arr));
        localStorage.setItem('current', JSON.stringify(this.current_player));
    }

    // add a play from player
    add_stone (x, y){
        const id = "#" + x + y;
        const player = this.players[this.current_player % 2];
        console.log(id);

        // Start from the bottom of the board and work up. Check if a player already
        // own the cell. If not update the cell
        for(let i=this.y-1;i>=0;i--){
            const value = this.arr[x][i];
            if (value === null || value === undefined){
                this.arr[x][i] = player;
                $("#" + x + i).css("background-color", player.color);
                this.current_player += 1;
                this.update_local_storage();
                this.set_current_player();
                this.highlight_cell('enter', x + y)
                this.calculate_win(x + i);
                break;
            }
            // When the highest cell is filled the row is full.
            else if((this.arr[x][0] !== null && this.arr[x][0] !== undefined)) {
                if (this.arr[x][0].name === this.players[0].name || this.arr[x][0].name === this.players[1].name) {
                    alert('Rij is vol');
                    break;
                }
            }
        }
    }

    // Highlight the cell where the next set will be
    highlight_cell(action, id){
        const x = id[0];
        const y = id[1];

        // Calculate the current cell where the next move will be
        for(let i=this.y-1;i>=0;i--){
            const value = this.arr[x][i]

            if (value === null || value === undefined){
                // On mouse over highlight correct cell
                if (action === 'enter'){
                    $("#" + x + i).css("background-color", this.players[this.current_player % 2].color);
                }
                // reset color when the cursor leaves
                else {
                    $("#" + x + i).css("background-color", "white");
                }
                break;
            }
        }
    }

    calculate_win(id){
        const coords = Array.from(Array(16), () => new Array(4));
        for (let x=0; x<4; x++) {
            for (let y=0; y<4;y++){
                coords[x][y] = (y - x) + ',' + 0;
                coords[x+4][y] = 0 + ',' + (y - x);
                coords[x+8][y] = (y - x) + ',' + (y - x);
                coords[x+12][y] = (x - y) + ',' + (y - x);
            }
        }

        console.log(coords);
        
        for (let x=0; x<coords.length; x++) {
            let player = null;
            for (let y=0; y<4;y++){
                const offset = coords[x][y].split(",");
                const a = parseInt(offset[0]);
                const b = parseInt(offset[1]);
                const c = parseInt(id[0]);
                const d = parseInt(id[1]);

                try {
                    if (y === 0) {
                        player = this.arr[c+a][d+b].name;
                    }
                    else if(player !== this.arr[c+a][d+b].name) {
                        console.log('Not same player');
                        break;
                    }
                    else if (y === 3) {
                        console.log(this.arr[c+a][d+b].name, coords[x]);
                        const player = this.players[this.current_player % 2].name
                        alert('Player ' + player  + ' has won');
                        this.reset(board);
                    }
                }
                catch(error) {
                    //console.log("out of bounds");
                    break;
                }
            }
        }
        

    }

    // Covert stored plays to board
    set_board(){
        for(var i=0;i<this.x;i++){
            for(var j=0;j<  this.y;j++){
                if (this.arr[i][j] !== null && this.arr[i][j] !== undefined){
                    $("#" + i + j).css("background-color", this.arr[i][j].color);
                }
            }
        }
    }

    // Calculate current player and update message
    set_current_player(){
        const player = this.players[this.current_player % 2];
        const string = "<p>Speler " + player.name + " is aan de beurt</p>"
        $("#playerDiv").html(string);
    }

    // Dynamically create board table based on x, y dimensions
    generate_table(board){
        var table_body = '<table><tbody>';
        for(var i=0;i<this.y;i++){
            table_body+='<tr>';
            for(var j=0;j<this.x;j++){
                table_body +='<td class="field" id="' + j + i + '">';
                table_body +='</td>';
            }
            table_body+='</tr>';
        }
        table_body+='</table>';
        $('#tableDiv').html(table_body);
        this.set_board();

        // Click event listener for each table cell
        $(".field").click(function() {
            const x = this.id[0];
            const y = this.id[1];
    
            board.add_stone(x, y);
        });

        // mouse enter/leave for each table cell
        $( ".field" ).mouseenter(function() {
            board.highlight_cell('enter', this.id)
        }).mouseleave(function(){
            board.highlight_cell('leave', this.id)
        });        
    }
}


class Player {
    constructor(name, color){
        this.name = name;
        this.color = color;
    }
}

// Players
const player1 = new Player("player1", "yellow");
const player2 = new Player("player2", "red");

const players = [player1, player2]

// Initialize board
let board = new Board(7, 6, players);
board.generate_table(board);

