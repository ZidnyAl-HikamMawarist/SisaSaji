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
$_ENV['SESSION_DRIVER'] = 'cookie';
putenv('SESSION_DRIVER=cookie');
$_ENV['CACHE_STORE'] = 'array';
putenv('CACHE_STORE=array');
$_ENV['LOG_CHANNEL'] = 'stderr';
putenv('LOG_CHANNEL=stderr');

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

require __DIR__ . '/../public/index.php';
