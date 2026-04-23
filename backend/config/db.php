<?php

$secureConfigPath = __DIR__ . '/secure_config.php';
if (file_exists($secureConfigPath)) {
    $secureConfig = require $secureConfigPath;
} else {
    // Fallback for when setup is not run yet
    $secureConfig = [
        'db_host' => 'localhost',
        'db_name' => 'emerald_cleaning',
        'db_user' => 'root',
        'db_pass' => '',
    ];
}

return [
    'class' => 'yii\db\Connection',
    'dsn' => 'mysql:host=' . $secureConfig['db_host'] . ';dbname=' . $secureConfig['db_name'],
    'username' => $secureConfig['db_user'],
    'password' => $secureConfig['db_pass'],
    'charset' => 'utf8mb4',

    // Schema cache options (for production environment)
    //'enableSchemaCache' => true,
    //'schemaCacheDuration' => 60,
    //'schemaCache' => 'cache',
];
