<?php
session_start();

// Initialisation du plateau si c'est la première fois
if (!isset($_SESSION["board"])) {
    $_SESSION["board"] = [
        "north" => [5,5,5,5,5,5],
        "south" => [5,5,5,5,5,5]
    ];
    $_SESSION["scores"] = ["north" => 0, "south" => 0];
    $_SESSION["currentPlayer"] = "south";
    $_SESSION["gameOver"] = false;
}

// Récupération du coup envoyé par le client
$data = json_decode(file_get_contents("php://input"), true);

if ($data && !$_SESSION["gameOver"]) {
    $joueur = $data["joueur"];
    $caseChoisie = $data["caseChoisie"];

    // Vérifier que c'est bien le tour du joueur
    if ($joueur === $_SESSION["currentPlayer"]) {
        $board = $_SESSION["board"];
        $graines = $board[$joueur][$caseChoisie];
        $board[$joueur][$caseChoisie] = 0;

        // Distribution des graines
        $camp = $joueur;
        $index = $caseChoisie;
        while ($graines > 0) {
            $index++;
            if ($index >= 6) {
                // Changement de camp
                $camp = ($camp === "south") ? "north" : "south";
                $index = 0;
            }
            $board[$camp][$index]++;
            $graines--;
        }

        // Capture si la dernière case contient 2 ou 3 graines
        if ($board[$camp][$index] == 2 || $board[$camp][$index] == 3) {
            $_SESSION["scores"][$joueur] += $board[$camp][$index];
            $board[$camp][$index] = 0;
        }

        // Mise à jour du plateau
        $_SESSION["board"] = $board;

        // Changement de joueur
        $_SESSION["currentPlayer"] = ($joueur === "south") ? "north" : "south";

        // Vérification fin de partie
        if (array_sum($board["north"]) == 0 || array_sum($board["south"]) == 0) {
            $_SESSION["scores"]["north"] += array_sum($board["north"]);
            $_SESSION["scores"]["south"] += array_sum($board["south"]);
            $_SESSION["gameOver"] = true;
        }
    }
}

// Réponse envoyée au client
echo json_encode([
    "board" => $_SESSION["board"],
    "scores" => $_SESSION["scores"],
    "currentPlayer" => $_SESSION["currentPlayer"],
    "gameOver" => $_SESSION["gameOver"]
]);
?>