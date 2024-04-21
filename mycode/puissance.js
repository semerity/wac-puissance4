export class grid {
    constructor(lignes,colonne){
        this.rows = lignes;
        this.columns = colonne;
        this.grid = new Array(this.columns);
        for (let index = 0; index < this.grid.length; index++) {
            this.grid[index] = new Array(this.rows);
        }
        for (let index = 0; index < this.grid.length; index++) {
            for (let dex = 0; dex < this.grid[index].length; dex++) {
                this.grid[index][dex] = new cell(dex, index);
            }
        }
    }
}

export class cell {
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.state = 0;
        this.LtR = 1;
        this.RtL = 1;
        this.Ver = 1;
        this.Hor = 1;
    }
}

export class player {
    constructor(id,col){
        this.id = id;
        this.color = col;
    }
    last_move(x,y){
        this.lastx = x;
        this.lasty = y; 
    }
}

export class game {
    constructor(col1 = "#FF445A",col2 = "#FFFF5A",nr = 6,nc = 7){
        this.pone = new player(1,col1);
        this.ptwo = new player(2,col2);
        this.board = new grid(nr,nc);
        this.gamestate = "Starting";
        this.playerturn = this.pone;
        document.body.style.height = "100%";
        document.body.style.display = "flex";
        document.body.style.flexDirection = "column";
        document.body.style.justifyContent = "center";
        document.body.style.alignItems = "center";
        
        // Player indicator
        const Player_indicator = document.createElement("h1");
        Player_indicator.id = "indicator";
        Player_indicator.innerText = ("à joueur " + this.playerturn.id + " de jouer").toUpperCase();
        Player_indicator.style.color = "white";
        Player_indicator.style.fontSize = "2rem";
        Player_indicator.style.fontFamily = "sans-serif";
        Player_indicator.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";

        document.body.appendChild(Player_indicator);

        // Board area
        const gamespace = document.createElement("div");
        gamespace.style.display = "flex";
        gamespace.style.alignItems = "center";
        document.body.appendChild(gamespace);
        let undoP1 = document.createElement("button");
        undoP1.addEventListener("click",()=>this.undomove(this.pone));
        undoP1.style.height = "2rem";
        undoP1.style.width = "fit-content";
        undoP1.innerText = "undo P1";
        gamespace.appendChild(undoP1);
        for (let index = 0; index < this.board.columns; index++) {
            let col = document.createElement("div");
            col.style.display = "flex";
            col.style.alignItems = "center"
            col.style.flexDirection = "column";
            col.style.backgroundColor = "#182123";
            col.style.height = "100%";
            col.classList.add(index);
            if (index == 0) {
                col.style.borderRadius = "3em 0 0 3em"
            }
            if (index == (this.board.columns -1)) {
                col.style.borderRadius = "0 3em 3em 0"
            }
            col.addEventListener("click", ()=>{
                this.played(index);
            })
            col.addEventListener("mouseenter", ()=>{
                if (typeof (this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0)) !== "undefined") {
                    // console.log(this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0));
                    let Last_empty_cell = this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0);
                    let slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
                    // console.log(slot);
                    // console.log(col);
                    slot.style.outline = "10px dashed" + this.playerturn.color;
                    slot.animate([
                        {transform: "rotate(360deg)"},
                    ],
                    {
                        duration: 3000,
                        iterations: Infinity,
                        easing: "linear",
                        direction: "normal",
                    },
                    );
                }
            })
            col.addEventListener("mouseleave", ()=>{
                if (typeof (this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0)) !== "undefined") {
                    let Last_empty_cell = this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0);
                    let slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
                    if (slot.getAnimations().length > 0) {
                        slot.getAnimations()[0].cancel();
                    }
                    // console.log(slot.getAnimations().length);
                    slot.style.outline = "0";
                }
            })
            gamespace.appendChild(col);
            for (let dex = 0; dex < this.board.rows; dex++) {
                let dot = document.createElement("div");
                dot.style.height = "5rem";
                dot.style.width = "5rem";
                dot.style.margin = "1rem"
                dot.style.borderRadius = "50%";
                dot.style.backgroundColor = "white";
                dot.id = dex + "-" + index;
                col.appendChild(dot);
            }
        }
        let undoP2 = document.createElement("button");
        undoP2.addEventListener("click",()=>this.undomove(this.ptwo));
        undoP2.style.height = "2rem";
        undoP2.style.width = "fit-content";
        undoP2.innerText = "undo P2";
        gamespace.appendChild(undoP2);

        let wincountdiv = document.createElement("div");
        wincountdiv.display = "flex";
        wincountdiv.style.width = "fit-content";
        document.body.appendChild(wincountdiv);
        if (sessionStorage.getItem(this.pone.id) !== null) {
            let winone = document.createElement("h3");
            winone.innerText = "Win joueur 1 : " + sessionStorage.getItem(this.pone.id);
            winone.style.color = this.pone.color;
            winone.style.fontSize = "2rem";
            winone.style.fontFamily = "sans-serif";
            winone.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
            winone.style.float = "left";
            winone.style.padding = "0 5rem";
            wincountdiv.appendChild(winone);
        }
        if (sessionStorage.getItem(this.ptwo.id) !== null) {
            let wintwo = document.createElement("h3");
            wintwo.innerText = "Win joueur 2 : " + sessionStorage.getItem(this.ptwo.id);
            wintwo.style.color = this.ptwo.color;
            wintwo.style.fontSize = "2rem";
            wintwo.style.fontFamily = "sans-serif";
            wintwo.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
            wintwo.style.float = "right";
            wintwo.style.padding = "0 5rem";
            wincountdiv.appendChild(wintwo);
        }
    }

    undomove(player){
        if (typeof player.lastx !== "undefined" && typeof player.lasty !== "undefined") {
            if(player.lastx !== "undefined" && player.lasty !== "undefined"){
                this.board.grid[player.lasty][player.lastx].state = 0;
                this.board.grid[player.lasty][player.lastx].LtR = 1;
                this.board.grid[player.lasty][player.lastx].RtL = 1;
                this.board.grid[player.lasty][player.lastx].Ver = 1;
                this.board.grid[player.lasty][player.lastx].Hor = 1;
                let dot = document.getElementById(player.lastx + "-" + player.lasty);
                dot.animate([
                    {transform:"scale(1,1)",backgroundColor: player.color},
                    {transform:"scale(0,0)",backgroundColor: player.color},
                    {transform:"scale(1,1)",backgroundColor: "white"}
                ],
                {
                    duration: 1000,
                    iterations: 1,
                    easing: "ease-in-out",
                    fill: "forwards",
                },
                );
                // console.log("ici ?");
                player.lastx = "undefined";
                player.lasty = "undefined";
                this.turnchanged();
            }
        }
    }

    played(column){
        // console.log(column);
        let Last_empty_cell = this.board.grid[column].findLast((elem) => elem.state == 0);
        // console.log(Last_empty_cell);
        // console.log(Last_empty_cell.x + "-" + Last_empty_cell.y);
        let slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
        // console.log(slot);
        // slot.style.backgroundColor = this.playerturn.color;
        slot.animate([
            {transform:"scale(1,1)"},
            {transform:"scale(0,0)",backgroundColor: "white"},
            {transform:"scale(1,1)",backgroundColor: this.playerturn.color}
        ],
        {
            duration: 1000,
            iterations: 1,
            easing: "ease-in-out",
            fill: "forwards",
        },
        );
        slot.style.outline = "0";
        Last_empty_cell.state = this.playerturn.id;
        this.playerturn.lastx = Last_empty_cell.x;
        this.playerturn.lasty = Last_empty_cell.y;

        if (this.checktie()) {
            const endtext = document.createElement("h1");
            endtext.innerText = "C'est fini et personne n'a gagné.";
            endtext.style.margin = 0;
            endtext.style.paddingLeft = document.body.clientWidth/2.5 + "px";
            endtext.style.paddingRight = document.body.clientWidth/2.5 + "px";
            endtext.style.paddingTop = document.body.clientHeight/3 + "px";
            endtext.style.display = "flex";
            endtext.style.flexDirection = "column";
            endtext.style.alignItems = "center";
            endtext.style.color = "white";
            endtext.style.textAlign = "center";
            endtext.style.fontFamily = "sans-serif"
            endtext.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
            endtext.style.backdropFilter = "blur(15px)";
            endtext.style.height = document.body.clientHeight + "px";
            endtext.style.position = "absolute";
            endtext.style.top = "0px";
            endtext.style.left = "0px";
            endtext.style.zIndex = "50";
            document.body.appendChild(endtext);
            const reset = document.createElement("button");
            reset.innerText = "Nouvelle partie";
            reset.style.height = "2rem";
            reset.style.width = "fit-content";
            reset.addEventListener("click",()=>this.restart())
            endtext.appendChild(reset);
        }

        if (this.checkwin(Last_empty_cell.x,Last_empty_cell.y)) {
            const endtext = document.createElement("h1");
            endtext.innerText = "joueur " + this.playerturn.id + " gagne";
            endtext.style.margin = 0;
            endtext.style.paddingLeft = document.body.clientWidth/2.5 + "px";
            endtext.style.paddingRight = document.body.clientWidth/2.5 + "px";
            endtext.style.paddingTop = document.body.clientHeight/3 + "px";
            endtext.style.display = "flex";
            endtext.style.flexDirection = "column";
            endtext.style.alignItems = "center";
            endtext.style.color = "white";
            endtext.style.textAlign = "center";
            endtext.style.fontFamily = "sans-serif"
            endtext.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
            endtext.style.backdropFilter = "blur(15px)";
            endtext.style.height = document.body.clientHeight + "px";
            endtext.style.position = "absolute";
            endtext.style.top = "0px";
            endtext.style.left = "0px";
            endtext.style.zIndex = "50";
            document.body.appendChild(endtext);
            const reset = document.createElement("button");
            reset.innerText = "Nouvelle partie";
            reset.style.height = "2rem";
            reset.style.width = "fit-content";
            reset.addEventListener("click",()=>this.restart())
            endtext.appendChild(reset);
            let wincount = 0;
            if (sessionStorage.getItem(this.playerturn.id) === null) {
                wincount = 1;
                sessionStorage.setItem(this.playerturn.id,wincount);
            } else {
                wincount = parseInt(sessionStorage.getItem(this.playerturn.id));
                wincount += 1;
                sessionStorage.setItem(this.playerturn.id,wincount);
            }
        }

        this.turnchanged();
        this.playerturn.lastx = "undefined";
        this.playerturn.lasty = "undefined";
    }

    checktie(){
        for (let index = 0; index < this.board.grid.length; index++) {
            for (let dex = 0; dex < this.board.grid[index].length; dex++) {
                // console.log(this.board.grid[index][dex]);
                if (this.board.grid[index][dex].state === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    checkwin(pawnX,pawnY){
        for (let i = -1; i < 2; i++) {
            if ((pawnX + i) >= 0 && pawnX+i < this.board.rows) {
                for (let e = -1; e < 2; e++) {
                    if ((pawnY + e) >= 0 && pawnY+e < this.board.columns) {
                        if (i == 0 && e == 0) {
                            // console.log("self");
                        } else {
                            // console.log(document.getElementById((pawnX+i) + "-" + (pawnY+e)) , " ", this.board.grid[pawnY+e][pawnX+i].state);
                            if (this.board.grid[pawnY+e][pawnX+i].state == this.board.grid[pawnY][pawnX].state) {
                                if (this.checkdir(pawnX,pawnY,i,e)) {
                                    return true;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    checkdir(pawnX,pawnY,dirX,dirY){
        let orgX = pawnX;
        let orgY = pawnY;
        while (pawnY in this.board.grid && pawnX in this.board.grid[pawnY]){
            if (this.board.grid[pawnY][pawnX] !== this.board.grid[orgY][orgX]) {
                if (dirX == 0) {
                    // console.log("X : " + pawnX,"Y : " + pawnY,"DIR X : " + dirX, "DIR X : " + dirY);
                    // console.log(this.board.grid[pawnY][pawnX]);
                    if (this.board.grid[pawnY][pawnX].state == this.playerturn.id) {
                        this.board.grid[orgY][orgX].Hor += 1;
                        // console.log(this.board.grid[orgY][orgX]);
                    }
                } else switch (dirY) {
                    case -1:
                        // console.log("X : " + pawnX,"Y : " + pawnY,"DIR X : " + dirX, "DIR X : " + dirY);
                        // console.log(this.board.grid[pawnY][pawnX]);
                        if (this.board.grid[pawnY][pawnX].state == this.playerturn.id) {
                            this.board.grid[orgY][orgX].LtR += 1;
                            // console.log(this.board.grid[orgY][orgX]);
                        }
                        break;
                    
                    case 0:
                        // console.log("X : " + pawnX,"Y : " + pawnY,"DIR X : " + dirX, "DIR X : " + dirY);
                        // console.log(this.board.grid[pawnY][pawnX]);
                        if (this.board.grid[pawnY][pawnX].state == this.playerturn.id) {
                            this.board.grid[orgY][orgX].Ver += 1;
                            // console.log(this.board.grid[orgY][orgX]);
                        }
                        break;
                    
                    case 1:
                        // console.log("X : " + pawnX,"Y : " + pawnY,"DIR X : " + dirX, "DIR X : " + dirY);
                        // console.log(this.board.grid[pawnY][pawnX]);
                        if (this.board.grid[pawnY][pawnX].state == this.playerturn.id) {
                            this.board.grid[orgY][orgX].RtL += 1;
                            // console.log(this.board.grid[orgY][orgX]);
                        }
                        break;
                }
            }
            pawnX += dirX;
            pawnY += dirY;

            if (this.board.grid[orgY][orgX].Hor >= 4) {
                return true;
            }
            if (this.board.grid[orgY][orgX].LtR >= 4) {
                return true;
            }
            if (this.board.grid[orgY][orgX].Ver >= 4) {
                return true;
            }
            if (this.board.grid[orgY][orgX].RtL >= 4) {
                return true;
            }
            // console.log(pawnX,pawnY,dirX,dirY);
            // console.log(this.board.grid[orgY][orgX].Hor," " , this.board.grid[orgY][orgX].Ver, " " ,this.board.grid[orgY][orgX].LtR," " , this.board.grid[orgY][orgX].RtL);
        }
    }

    restart(){
        location.reload();
    }

    turnchanged(){
        switch (this.playerturn) {
            case this.pone:
                this.playerturn = this.ptwo;
                break;
            case this.ptwo:
                this.playerturn = this.pone;
                break;
        }
        const Player_indicator = document.getElementById("indicator");
        Player_indicator.innerText = ("à joueur " + this.playerturn.id + " de jouer").toUpperCase();
    }
}

new game("#00ACFF","#B7FFDC",6,7)