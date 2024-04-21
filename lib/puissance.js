"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.player = exports.grid = exports.game = exports.cell = void 0;
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : String(i); }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
var grid = exports.grid = /*#__PURE__*/_createClass(function grid(lignes, colonne) {
  _classCallCheck(this, grid);
  this.rows = lignes;
  this.columns = colonne;
  this.grid = new Array(this.columns);
  for (var index = 0; index < this.grid.length; index++) {
    this.grid[index] = new Array(this.rows);
  }
  for (var _index = 0; _index < this.grid.length; _index++) {
    for (var dex = 0; dex < this.grid[_index].length; dex++) {
      this.grid[_index][dex] = new cell(dex, _index);
    }
  }
});
var cell = exports.cell = /*#__PURE__*/_createClass(function cell(x, y) {
  _classCallCheck(this, cell);
  this.x = x;
  this.y = y;
  this.state = 0;
  this.LtR = 1;
  this.RtL = 1;
  this.Ver = 1;
  this.Hor = 1;
});
var player = exports.player = /*#__PURE__*/function () {
  function player(id, col) {
    _classCallCheck(this, player);
    this.id = id;
    this.color = col;
  }
  _createClass(player, [{
    key: "last_move",
    value: function last_move(x, y) {
      this.lastx = x;
      this.lasty = y;
    }
  }]);
  return player;
}();
var game = exports.game = /*#__PURE__*/function () {
  function game() {
    var _this = this;
    var col1 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "#FF445A";
    var col2 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "#FFFF5A";
    var nr = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 6;
    var nc = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 7;
    _classCallCheck(this, game);
    this.pone = new player(1, col1);
    this.ptwo = new player(2, col2);
    this.board = new grid(nr, nc);
    this.gamestate = "Starting";
    this.playerturn = this.pone;
    document.body.style.height = "100%";
    document.body.style.display = "flex";
    document.body.style.flexDirection = "column";
    document.body.style.justifyContent = "center";
    document.body.style.alignItems = "center";

    // Player indicator
    var Player_indicator = document.createElement("h1");
    Player_indicator.id = "indicator";
    Player_indicator.innerText = ("à joueur " + this.playerturn.id + " de jouer").toUpperCase();
    Player_indicator.style.color = "white";
    Player_indicator.style.fontSize = "2rem";
    Player_indicator.style.fontFamily = "sans-serif";
    Player_indicator.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
    document.body.appendChild(Player_indicator);

    // Board area
    var gamespace = document.createElement("div");
    gamespace.style.display = "flex";
    gamespace.style.alignItems = "center";
    document.body.appendChild(gamespace);
    var undoP1 = document.createElement("button");
    undoP1.addEventListener("click", function () {
      return _this.undomove(_this.pone);
    });
    undoP1.style.height = "2rem";
    undoP1.style.width = "fit-content";
    undoP1.innerText = "undo P1";
    gamespace.appendChild(undoP1);
    var _loop = function _loop(index) {
      var col = document.createElement("div");
      col.style.display = "flex";
      col.style.alignItems = "center";
      col.style.flexDirection = "column";
      col.style.backgroundColor = "blue";
      col.style.height = "100%";
      col.classList.add(index);
      if (index == 0) {
        col.style.borderRadius = "3em 0 0 3em";
      }
      if (index == _this.board.columns - 1) {
        col.style.borderRadius = "0 3em 3em 0";
      }
      col.addEventListener("click", function () {
        _this.played(index);
      });
      col.addEventListener("mouseenter", function () {
        if (typeof _this.board.grid[col.classList[0]].findLast(function (elem) {
          return elem.state == 0;
        }) !== "undefined") {
          // console.log(this.board.grid[col.classList[0]].findLast((elem) => elem.state == 0));
          var Last_empty_cell = _this.board.grid[col.classList[0]].findLast(function (elem) {
            return elem.state == 0;
          });
          var slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
          // console.log(slot);
          // console.log(col);
          slot.style.outline = "10px dashed" + _this.playerturn.color;
          slot.animate([{
            transform: "rotate(360deg)"
          }], {
            duration: 3000,
            iterations: Infinity,
            easing: "linear",
            direction: "normal"
          });
        }
      });
      col.addEventListener("mouseleave", function () {
        if (typeof _this.board.grid[col.classList[0]].findLast(function (elem) {
          return elem.state == 0;
        }) !== "undefined") {
          var Last_empty_cell = _this.board.grid[col.classList[0]].findLast(function (elem) {
            return elem.state == 0;
          });
          var slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
          if (slot.getAnimations().length > 0) {
            slot.getAnimations()[0].cancel();
          }
          // console.log(slot.getAnimations().length);
          slot.style.outline = "0";
        }
      });
      gamespace.appendChild(col);
      for (var dex = 0; dex < _this.board.rows; dex++) {
        var dot = document.createElement("div");
        dot.style.height = "5rem";
        dot.style.width = "5rem";
        dot.style.margin = "1rem";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = "white";
        dot.id = dex + "-" + index;
        col.appendChild(dot);
      }
    };
    for (var index = 0; index < this.board.columns; index++) {
      _loop(index);
    }
    var undoP2 = document.createElement("button");
    undoP2.addEventListener("click", function () {
      return _this.undomove(_this.ptwo);
    });
    undoP2.style.height = "2rem";
    undoP2.style.width = "fit-content";
    undoP2.innerText = "undo P2";
    gamespace.appendChild(undoP2);
  }
  _createClass(game, [{
    key: "undomove",
    value: function undomove(player) {
      if (typeof player.lastx !== "undefined" && typeof player.lasty !== "undefined") {
        if (player.lastx !== "undefined" && player.lasty !== "undefined") {
          this.board.grid[player.lasty][player.lastx].state = 0;
          this.board.grid[player.lasty][player.lastx].LtR = 1;
          this.board.grid[player.lasty][player.lastx].RtL = 1;
          this.board.grid[player.lasty][player.lastx].Ver = 1;
          this.board.grid[player.lasty][player.lastx].Hor = 1;
          var dot = document.getElementById(player.lastx + "-" + player.lasty);
          dot.animate([{
            transform: "scale(1,1)",
            backgroundColor: player.color
          }, {
            transform: "scale(0,0)",
            backgroundColor: player.color
          }, {
            transform: "scale(1,1)",
            backgroundColor: "white"
          }], {
            duration: 1000,
            iterations: 1,
            easing: "ease-in-out",
            fill: "forwards"
          });
          // console.log("ici ?");
          player.lastx = "undefined";
          player.lasty = "undefined";
          this.turnchanged();
        }
      }
    }
  }, {
    key: "played",
    value: function played(column) {
      var _this2 = this;
      // console.log(column);
      var Last_empty_cell = this.board.grid[column].findLast(function (elem) {
        return elem.state == 0;
      });
      // console.log(Last_empty_cell);
      // console.log(Last_empty_cell.x + "-" + Last_empty_cell.y);
      var slot = document.getElementById(Last_empty_cell.x + "-" + Last_empty_cell.y);
      // console.log(slot);
      // slot.style.backgroundColor = this.playerturn.color;
      slot.animate([{
        transform: "scale(1,1)"
      }, {
        transform: "scale(0,0)",
        backgroundColor: "white"
      }, {
        transform: "scale(1,1)",
        backgroundColor: this.playerturn.color
      }], {
        duration: 1000,
        iterations: 1,
        easing: "ease-in-out",
        fill: "forwards"
      });
      slot.style.outline = "0";
      Last_empty_cell.state = this.playerturn.id;
      this.playerturn.lastx = Last_empty_cell.x;
      this.playerturn.lasty = Last_empty_cell.y;
      if (this.checktie()) {
        var endtext = document.createElement("h1");
        endtext.innerText = "C'est fini et personne n'a gagné.";
        endtext.style.margin = 0;
        endtext.style.paddingLeft = document.body.clientWidth / 2.5 + "px";
        endtext.style.paddingRight = document.body.clientWidth / 2.5 + "px";
        endtext.style.paddingTop = document.body.clientHeight / 3 + "px";
        endtext.style.display = "flex";
        endtext.style.flexDirection = "column";
        endtext.style.alignItems = "center";
        endtext.style.color = "white";
        endtext.style.textAlign = "center";
        endtext.style.fontFamily = "sans-serif";
        endtext.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
        endtext.style.backdropFilter = "blur(15px)";
        endtext.style.height = document.body.clientHeight + "px";
        endtext.style.position = "absolute";
        endtext.style.top = "0px";
        endtext.style.left = "0px";
        endtext.style.zIndex = "50";
        document.body.appendChild(endtext);
        var reset = document.createElement("button");
        reset.innerText = "Nouvelle partie";
        reset.style.height = "2rem";
        reset.style.width = "fit-content";
        reset.addEventListener("click", function () {
          return _this2.restart();
        });
        endtext.appendChild(reset);
      }
      if (this.checkwin(Last_empty_cell.x, Last_empty_cell.y)) {
        var _endtext = document.createElement("h1");
        _endtext.innerText = "joueur " + this.playerturn.id + "gagne";
        _endtext.style.margin = 0;
        _endtext.style.paddingLeft = document.body.clientWidth / 2.5 + "px";
        _endtext.style.paddingRight = document.body.clientWidth / 2.5 + "px";
        _endtext.style.paddingTop = document.body.clientHeight / 3 + "px";
        _endtext.style.display = "flex";
        _endtext.style.flexDirection = "column";
        _endtext.style.alignItems = "center";
        _endtext.style.color = "white";
        _endtext.style.textAlign = "center";
        _endtext.style.fontFamily = "sans-serif";
        _endtext.style.textShadow = "2px 0 0 #000, 0 -2px 0 #000, 0 2px 0 #000, -2px 0 0 #000";
        _endtext.style.backdropFilter = "blur(15px)";
        _endtext.style.height = document.body.clientHeight + "px";
        _endtext.style.position = "absolute";
        _endtext.style.top = "0px";
        _endtext.style.left = "0px";
        _endtext.style.zIndex = "50";
        document.body.appendChild(_endtext);
        var _reset = document.createElement("button");
        _reset.innerText = "Nouvelle partie";
        _reset.style.height = "2rem";
        _reset.style.width = "fit-content";
        _reset.addEventListener("click", function () {
          return _this2.restart();
        });
        _endtext.appendChild(_reset);
      }
      this.turnchanged();
      this.playerturn.lastx = "undefined";
      this.playerturn.lasty = "undefined";
    }
  }, {
    key: "checktie",
    value: function checktie() {
      for (var index = 0; index < this.board.grid.length; index++) {
        for (var dex = 0; dex < this.board.grid[index].length; dex++) {
          // console.log(this.board.grid[index][dex]);
          if (this.board.grid[index][dex].state === 0) {
            return false;
          }
        }
      }
      return true;
    }
  }, {
    key: "checkwin",
    value: function checkwin(pawnX, pawnY) {
      for (var i = -1; i < 2; i++) {
        if (pawnX + i >= 0 && pawnX + i < this.board.rows) {
          for (var e = -1; e < 2; e++) {
            if (pawnY + e >= 0 && pawnY + e < this.board.columns) {
              if (i == 0 && e == 0) {
                // console.log("self");
              } else {
                // console.log(document.getElementById((pawnX+i) + "-" + (pawnY+e)) , " ", this.board.grid[pawnY+e][pawnX+i].state);
                if (this.board.grid[pawnY + e][pawnX + i].state == this.board.grid[pawnY][pawnX].state) {
                  if (this.checkdir(pawnX, pawnY, i, e)) {
                    return true;
                  }
                }
              }
            }
          }
        }
      }
    }
  }, {
    key: "checkdir",
    value: function checkdir(pawnX, pawnY, dirX, dirY) {
      var orgX = pawnX;
      var orgY = pawnY;
      while (pawnY in this.board.grid && pawnX in this.board.grid[pawnY]) {
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
  }, {
    key: "restart",
    value: function restart() {
      location.reload();
    }
  }, {
    key: "turnchanged",
    value: function turnchanged() {
      switch (this.playerturn) {
        case this.pone:
          this.playerturn = this.ptwo;
          break;
        case this.ptwo:
          this.playerturn = this.pone;
          break;
      }
      var Player_indicator = document.getElementById("indicator");
      Player_indicator.innerText = ("à joueur " + this.playerturn.id + " de jouer").toUpperCase();
    }
  }]);
  return game;
}();
new game("#00ACFF", "#B70FDC", 6, 7);