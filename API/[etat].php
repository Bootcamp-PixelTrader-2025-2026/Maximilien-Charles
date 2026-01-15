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

    $path = $_SERVER['PATH_INFO'] ?? null;
    
    if ($path) {
        $etat = ltrim($path, '/');
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
        // Pas de PATH_INFO = erreur
        $retour = [
            "success" => false,
            "message" => "Veuillez spécifier un état dans l'URL"
        ];
    }

} catch (PDOException $e) {
    $retour = [
        "success" => false,
        "data" => $e->getMessage()
    ];
}

echo json_encode($retour);