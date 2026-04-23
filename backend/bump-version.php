<?php
/**
 * Bump Version Script
 * Run this from CLI: php bump-version.php
 */

if (php_sapi_name() !== 'cli') {
    die("This script can only be run from the command line.");
}

$versionFile = __DIR__ . '/config/version.php';
$versionData = file_exists($versionFile) ? require $versionFile : ['version' => '1.0.0'];

$currentVersion = $versionData['version'] ?? '1.0.0';
echo "Current Version: $currentVersion\n";

// Only bump patch version since minor/major should not change without user instruction
$parts = explode('.', $currentVersion);
if (count($parts) === 3) {
    $parts[2] = (int)$parts[2] + 1;
    $newVersion = implode('.', $parts);
} else {
    $newVersion = '1.0.1'; // Fallback
}

$date = date('Y-m-d');

$content = "<?php\n" .
    "// AUTO-GENERATED VERSION FILE\n" .
    "// DO NOT MODIFY MANUALLY. USE BUMP-VERSION SCRIPT.\n\n" .
    "return [\n" .
    "    'version' => '$newVersion',\n" .
    "    'last_updated' => '$date',\n" .
    "];\n";

file_put_contents($versionFile, $content);

echo "Version bumped to $newVersion\n";
