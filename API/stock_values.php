<?php

header('Content-Type: application/json');

try {
    $pdo = new PDO(
        'mysql:host=localhost;port=3306;dbname=pixeltrader;charset=utf8',
        'root',
        '',
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ]
    );

    $requete = $pdo->prepare ("SELECT * FROM stock_values");
    
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