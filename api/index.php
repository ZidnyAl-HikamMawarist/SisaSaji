<?php

/**
 * Vercel Entrypoint for Laravel 11.
 * Forwards requests to the standard public/index.php file.
 */

// Setup storage path in /tmp because Vercel is read-only
$tmpStorage = '/tmp/storage';
$_ENV['APP_STORAGE'] = $tmpStorage;
putenv('APP_STORAGE=' . $tmpStorage);

// Force serverless-friendly drivers
$_ENV['APP_DEBUG'] = 'false';
putenv('APP_DEBUG=false');
$_ENV['SESSION_DRIVER'] = 'cookie';
putenv('SESSION_DRIVER=cookie');
$_ENV['CACHE_STORE'] = 'array';
putenv('CACHE_STORE=array');
$_ENV['LOG_CHANNEL'] = 'stderr';
putenv('LOG_CHANNEL=stderr');
$_ENV['VIEW_COMPILED_PATH'] = "$tmpStorage/framework/views";
putenv('VIEW_COMPILED_PATH=' . $_ENV['VIEW_COMPILED_PATH']);

// Force cache paths to /tmp so Laravel doesn't use stale Vercel build caches
$_ENV['APP_SERVICES_CACHE'] = "$tmpStorage/bootstrap/cache/services.php";
putenv('APP_SERVICES_CACHE=' . $_ENV['APP_SERVICES_CACHE']);
$_ENV['APP_PACKAGES_CACHE'] = "$tmpStorage/bootstrap/cache/packages.php";
putenv('APP_PACKAGES_CACHE=' . $_ENV['APP_PACKAGES_CACHE']);
$_ENV['APP_CONFIG_CACHE'] = "$tmpStorage/bootstrap/cache/config.php";
putenv('APP_CONFIG_CACHE=' . $_ENV['APP_CONFIG_CACHE']);
$_ENV['APP_ROUTES_CACHE'] = "$tmpStorage/bootstrap/cache/routes-v7.php";
putenv('APP_ROUTES_CACHE=' . $_ENV['APP_ROUTES_CACHE']);
$_ENV['APP_EVENTS_CACHE'] = "$tmpStorage/bootstrap/cache/events.php";
putenv('APP_EVENTS_CACHE=' . $_ENV['APP_EVENTS_CACHE']);

// Ensure essential Laravel directories exist in /tmp
$directories = [
    "$tmpStorage/app/public",
    "$tmpStorage/framework/cache/data",
    "$tmpStorage/framework/sessions",
    "$tmpStorage/framework/testing",
    "$tmpStorage/framework/views",
    "$tmpStorage/logs",
    "$tmpStorage/bootstrap/cache",
];

foreach ($directories as $dir) {
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
}

try {
    require __DIR__ . '/../public/index.php';
} catch (\Throwable $e) {
    echo "<h1>Real Exception Caught!</h1>";
    echo "<pre>";
    echo "Message: " . $e->getMessage() . "\n";
    echo "File: " . $e->getFile() . ":" . $e->getLine() . "\n";
    echo "Stack trace:\n" . $e->getTraceAsString();
    echo "</pre>";
    
    // Also print previous exception if any
    if ($prev = $e->getPrevious()) {
        echo "<h2>Previous Exception:</h2>";
        echo "<pre>";
        echo "Message: " . $prev->getMessage() . "\n";
        echo "File: " . $prev->getFile() . ":" . $prev->getLine() . "\n";
        echo "Stack trace:\n" . $prev->getTraceAsString();
        echo "</pre>";
    }
}
