<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->append(function ($request, $next) {
            $response = $next($request);
            if (method_exists($response, 'header')) {
                $response->header('X-Content-Type-Options', 'nosniff');
                $response->header('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            } elseif (isset($response->headers)) {
                $response->headers->set('X-Content-Type-Options', 'nosniff');
                $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
            }
            return $response;
        });
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        //
    })->create();

if (isset($_ENV['APP_STORAGE'])) {
    $app->useStoragePath($_ENV['APP_STORAGE']);
}

return $app;
