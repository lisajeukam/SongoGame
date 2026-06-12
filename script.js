// Variables globales
let board = {
  north: [5, 5, 5, 5, 5, 5],
  south: [5, 5, 5, 5, 5, 5]
};

let scores = { north: 0, south: 0 };
let currentPlayer = "south";
let gameOver = false;
let turnCount = 0; // compteur de tours

// Affichage du plateau avec billes
function renderBoard() {
  document.getElementById("north").innerHTML =
    board.north.map((g, i) => {
      let seedsHTML = "";
      for (let k = 0; k < g; k++) {
        seedsHTML += "<span class='seed north-seed'></span>";
      }
      return `<div class="case" onclick="play('north',${i})">${seedsHTML}</div>`;
    }).join("");

  document.getElementById("south").innerHTML =
    board.south.map((g, i) => {
      let seedsHTML = "";
      for (let k = 0; k < g; k++) {
        seedsHTML += "<span class='seed south-seed'></span>";
      }
      return `<div class="case" onclick="play('south',${i})">${seedsHTML}</div>`;
    }).join("");

  document.getElementById("score-north").textContent = scores.north;
  document.getElementById("score-south").textContent = scores.south;
  document.getElementById("turn-count").textContent = turnCount; // compteur
  document.getElementById("current-player").textContent =
    currentPlayer === "south" ? "Sud" : "Nord"; // joueur en cours
}

// Vérifier si le coup affame l’adversaire
function wouldStarveOpponent(side, index) {
  let tempBoard = JSON.parse(JSON.stringify(board));
  let seeds = tempBoard[side][index];
  if (seeds === 0) return false;

  tempBoard[side][index] = 0;
  let row = side;
  let col = index;

  while (seeds > 0) {
    col++;
    if (col >= 6) {
      row = (row === "south") ? "north" : "south";
      col = 0;
    }
    tempBoard[row][col]++;
    seeds--;
  }

  let opponent = (side === "south") ? "north" : "south";
  return tempBoard[opponent].every(g => g === 0);
}

// Vérifier fin de partie
function checkGameOver() {
  if (board.north.every(g => g === 0) || board.south.every(g => g === 0)) {
    scores.north += board.north.reduce((a, b) => a + b, 0);
    scores.south += board.south.reduce((a, b) => a + b, 0);

    board.north = [0, 0, 0, 0, 0, 0];
    board.south = [0, 0, 0, 0, 0, 0];
    gameOver = true;

    renderBoard();

    if (scores.north > scores.south) {
      alert("🎉 Fin de partie ! Le camp Nord gagne avec " + scores.north + " graines !");
    } else if (scores.south > scores.north) {
      alert("🎉 Fin de partie ! Le camp Sud gagne avec " + scores.south + " graines !");
    } else {
      alert("🤝 Fin de partie ! Match nul !");
    }
  }
}

// Logique du jeu
function play(side, index) {
  if (gameOver) return;
  if (side !== currentPlayer || board[side][index] === 0) return;

  if (wouldStarveOpponent(side, index)) {
    alert("Coup interdit : tu ne peux pas affamer ton adversaire !");
    return;
  }

  let seeds = board[side][index];
  board[side][index] = 0;

  let row = side;
  let col = index;

  while (seeds > 0) {
    col++;
    if (col >= 6) {
      row = (row === "south") ? "north" : "south";
      col = 0;
    }
    board[row][col]++;
    seeds--;
  }

  if (row !== side) {
    let lastSeeds = board[row][col];
    if (lastSeeds === 2 || lastSeeds === 3 || lastSeeds === 4) {
      scores[side] += lastSeeds;
      board[row][col] = 0;
    }
  }

  // Incrémenter le compteur de tours
  turnCount++;

  // Changer de joueur
  currentPlayer = (currentPlayer === "south") ? "north" : "south";

  renderBoard();
  checkGameOver();
}

// Initialisation
renderBoard();// Fonction Reset
function resetGame() {
  board = {
    north: [5, 5, 5, 5, 5, 5],
    south: [5, 5, 5, 5, 5, 5]
  };
  scores = { north: 0, south: 0 };
  currentPlayer = "south";
  gameOver = false;
  turnCount = 0;
  renderBoard();
}