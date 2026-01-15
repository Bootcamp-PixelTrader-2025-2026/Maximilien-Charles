<?php

header('Content-Type: application/json');

try {
    $pdo = new PDO(
        'mysql:host=localhost;port=8889;dbname=pixeltrader;charset=utf8',
        'root',
        'root',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    $requete = $pdo->prepare ("SELECT * FROM games");
    $requete->execute();

    $retour = [
        "success" => true,
        "data" => $requete->fetchAll(PDO::FETCH_ASSOC)
    ];

} catch (PDOException $e) {
    $retour = [
        "success" => false,
        "data" => $e->getMessage()
    ];
}

echo json_encode($retour);