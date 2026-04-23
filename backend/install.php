<?php
/**
 * Emerald Cleaning System Setup Script
 * Run this from CLI: php install.php
 */

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.");
}

$configFile = __DIR__ . '/config/secure_config.php';

echo "========================================\n";
echo "  Emerald Cleaning System Installer\n";
echo "  Version: 1.0.0\n";
echo "========================================\n\n";

if (file_exists($configFile)) {
    echo "secure_config.php already exists. Skipping config generation.\n";
} else {
    echo "Please enter database credentials:\n";
    $dbHost = readline("Database Host [localhost]: ");
    if (empty($dbHost)) $dbHost = 'localhost';
    
    $dbName = readline("Database Name [emerald_cleaning]: ");
    if (empty($dbName)) $dbName = 'emerald_cleaning';
    
    $dbUser = readline("Database Username [root]: ");
    if (empty($dbUser)) $dbUser = 'root';
    
    $dbPass = readline("Database Password []: ");
    
    $appName = readline("Application Name [Emerald Cleaning Manager]: ");
    if (empty($appName)) $appName = 'Emerald Cleaning Manager';
    
    $masterPass = readline("Master Login Password (for 'cstudios'): ");
    if (empty($masterPass)) {
        echo "Master password cannot be empty!\n";
        exit(1);
    }
    
    $masterPassHash = password_hash($masterPass, PASSWORD_BCRYPT);
    
    $configContent = "<?php\n" .
        "// AUTO-GENERATED CONFIGURATION\n" .
        "// DO NOT COMMIT THIS FILE TO VERSION CONTROL\n\n" .
        "return [\n" .
        "    'db_host' => '$dbHost',\n" .
        "    'db_name' => '$dbName',\n" .
        "    'db_user' => '$dbUser',\n" .
        "    'db_pass' => '$dbPass',\n" .
        "    'app_name' => '$appName',\n" .
        "    'master_password_hash' => '$masterPassHash',\n" .
        "    'cookie_validation_key' => '" . bin2hex(random_bytes(16)) . "',\n" .
        "];\n";
        
    file_put_contents($configFile, $configContent);
    chmod($configFile, 0640);
    echo "Config saved to $configFile\n\n";
}

echo "Running migrations...\n";
system('php yii migrate --interactive=0');

echo "\nSetup completed successfully!\n";
