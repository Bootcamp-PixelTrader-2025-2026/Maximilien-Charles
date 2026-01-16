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

    $id = $_GET['id'] ?? null;
    $etat = $_GET['etat'] ?? null;
    
    if ($id) {
        $requete = $pdo->prepare("SELECT * FROM games WHERE id = :id");
        $requete->execute(['id' => $id]);
        $data = $requete->fetch(PDO::FETCH_ASSOC);
        
        if ($data) {
            $retour = [
                "success" => true,
                "data" => $data
            ];
        } else {
            $retour = [
                "success" => false,
                "message" => "Jeu non trouvé avec l'ID: " . $id
            ];
        }
    } elseif ($etat) {
        $etatsValides = ['Excellent', 'Bon', 'Moyen', 'Mauvais'];
        
        if (in_array($etat, $etatsValides)) {
            $requete = $pdo->prepare("SELECT * FROM games WHERE etat = :etat");
            $requete->execute(['etat' => $etat]);
            
            $retour = [
                "success" => true,
                "data" => $requete->fetchAll(PDO::FETCH_ASSOC)
            ];
        } else {
            $retour = [
                "success" => false,
                "message" => "État invalide. Valeurs acceptées: Excellent, Bon, Moyen, Mauvais"
            ];
        }
    } else {
        $requete = $pdo->prepare("SELECT * FROM games");
        $requete->execute();
        
        $retour = [
            "success" => true,
            "data" => $requete->fetchAll(PDO::FETCH_ASSOC)
        ];
    }

} catch (PDOException $e) {
    $retour = [
        "success" => false,
        "data" => $e->getMessage()
    ];
}

echo json_encode($retour);