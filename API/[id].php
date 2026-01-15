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
        $id = ltrim($path, '/');
        
        if (is_numeric($id)) {
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
        } else {
            $retour = [
                "success" => false,
                "message" => "L'ID doit être un nombre"
            ];
        }
    } else {
        $retour = [
            "success" => false,
            "message" => "Veuillez spécifier un ID dans l'URL"
        ];
    }

} catch (PDOException $e) {
    $retour = [
        "success" => false,
        "data" => $e->getMessage()
    ];
}

echo json_encode($retour);