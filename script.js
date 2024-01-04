document.addEventListener("DOMContentLoaded", function () {

    const filligramme = document.querySelector("#afficheWiner")
    const contenu = document.querySelector(".contenu")
    const boardContainer = document.getElementById("board-container");
    const scoresElement = document.getElementById("scores");
    let size = prompt("Entrez la taille de la grille de jeu:");
    if (size > 2) {
        size = parseInt(size) || 6;
    } else {
        size = 6
    }
    document.documentElement.style.setProperty('--size', size);

    // tirage au sort pour savoir qui commence
    let beginner = Math.round(Math.random())
    let currentPlayer
    if (beginner == 0) {
        alert("le tirage aléatoire permet de nous dire que le jour qui commence est : Black")

        currentPlayer = "black"; // Le joueur noir commence
        document.querySelector('.joueur1').classList.add("turn1")
        document.querySelector('.joueur2').classList.remove("turn2")
    } else {
        alert("le tirage aléatoire permet de nous dire que le jour qui commence est : White")
        currentPlayer = "white"; // Le joueur noir commence

        document.querySelector('.joueur1').classList.remove("turn1")
        document.querySelector('.joueur2').classList.add("turn2")
    }
    document.querySelector("#idJoueur").innerHTML = currentPlayer
    let board = initializeBoard(size);
    let scores = { black: 0, white: 0 };

    renderBoard();

    //terminer lorsque un joueur abandonne
    document.addEventListener("keydown", function (event) {
        if (event.key === " " || event.key === "Spacebar" || event.keyCode === 32) {
            abandonGame();
        }
    });


    // cettes fonction permet d'initialiser la grille grace a la valeur entrée dans le prompt et aussi tôt placer les pions au millieu de la matrice
    function initializeBoard(size) {
        const board = [];
        for (let i = 0; i < size; i++) {
            const row = Array(size).fill(0);
            board.push(row);
        }
        // Placer les pions au centre
        const center = Math.floor(size / 2);
        board[center - 1][center - 1] = "black";
        board[center - 1][center] = "white";
        board[center][center - 1] = "white";
        board[center][center] = "black";
        return board;
    }

    function renderBoard() {
        boardContainer.innerHTML = "";
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener("click", handleCellClick);

                if (board[i][j]) {
                    const piece = document.createElement("div");
                    piece.classList.add(board[i][j]);
                    cell.appendChild(piece);
                }

                boardContainer.appendChild(cell);
            }
        }
        updateScores();
    }

    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col] === 0 && isAdjacentToOtherPion(row, col)) {
            board[row][col] = currentPlayer;
            checkScores(row, col);
            currentPlayer = currentPlayer === "black" ? "white" : "black";
            if (currentPlayer == "black") {
                document.querySelector('.joueur1').classList.add("turn1")
                document.querySelector('.joueur2').classList.remove("turn2")
            } else {
                document.querySelector('.joueur1').classList.remove("turn1")
                document.querySelector('.joueur2').classList.add("turn2")
            }
            document.querySelector("#idJoueur").innerHTML = currentPlayer
            renderBoard();
        }
    }
    function isAdjacentToOtherPion(row, col) {
        // Vérifie si la cellule est adjacente (y compris diagonale) à une cellule déjà occupée par un pion
        for (let i = row - 1; i <= row + 1; i++) {
            for (let j = col - 1; j <= col + 1; j++) {
                if (i >= 0 && i < size && j >= 0 && j < size && board[i][j] !== 0) {
                    return true;
                }
            }
        }
        alert("Placement interdit")
        return false;
    }

    function abandonGame() {
        // Déterminez l'autre joueur comme gagnant
        const otherPlayer = currentPlayer === "black" ? "white" : "black";
        const valeurScore = scores[otherPlayer]

        // Affichez le message d'abandon et le gagnant
        alert(`${currentPlayer} a abandonné. ${otherPlayer} gagne !`);
        document.querySelector("#score-value").innerHTML = valeurScore
        document.querySelector("#vainqueur").innerHTML = otherPlayer
        filligramme.style.display = "flex"
        contenu.style.display = "block"
    }


    function checkScores(row, col) {
        scores[currentPlayer] = Math.max(
            scores[currentPlayer],
            countConsecutive(row, col, 1, 0) + countConsecutive(row, col, -1, 0) + 1,
            countConsecutive(row, col, 0, 1) + countConsecutive(row, col, 0, -1) + 1,
            countConsecutive(row, col, 1, 1) + countConsecutive(row, col, -1, -1) + 1,
            countConsecutive(row, col, 1, -1) + countConsecutive(row, col, -1, 1) + 1
        );

        //terminer si le max est egal a la taille de la matrice
        if (scores.black == size) {
            document.querySelector("#score-value").innerHTML = scores.black
            document.querySelector("#vainqueur").innerHTML = "Black"
            filligramme.style.display = "flex"
            contenu.style.display = "block"
        } else if (scores.white == size) {
            document.querySelector("#score-value").innerHTML = scores.white
            document.querySelector("#vainqueur").innerHTML = "White"
            filligramme.style.display = "flex"
            contenu.style.display = "block"
        }

        //terminer si la grille est pleine
        if (isBoardFull()) {
            document.querySelector("#score-value").innerHTML = Math.max(scores.black, scores.white)
            if (scores.black == scores.white) {
                // alert("match null")
                document.querySelector("#vainqueur").innerHTML = "Match Null"
            } else if (Math.max(scores.black, scores.white) == scores.black) {
                document.querySelector("#vainqueur").innerHTML = "Black"
            } else if (Math.max(scores.black, scores.white) == scores.white) {
                document.querySelector("#vainqueur").innerHTML = "White"
            }
        }
    }

    function countConsecutive(row, col, rowDir, colDir) {
        let count = 0;
        while (
            row + rowDir >= 0 && row + rowDir < size &&
            col + colDir >= 0 && col + colDir < size &&
            board[row + rowDir][col + colDir] === currentPlayer
        ) {
            count++;
            row += rowDir;
            col += colDir;
        }
        return count;
    }

    function updateScores() {
        document.querySelector("#scr-black-value").innerHTML = scores.black
        document.querySelector("#scr-white-value").innerHTML = scores.white
        // scoresElement.innerHTML = `Scores:<br>Black: ${scores.black}<br>White: ${scores.white}`;
    }

    function isBoardFull() {
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if (board[i][j] === 0) {
                    return false;
                }
            }
        }
        filligramme.style.display = "flex"
        contenu.style.display = "block"
        return true;
    }

});


function fermer() {
    alert("Merci d'avoir joué !!! ^^")
    window.location.reload()
}