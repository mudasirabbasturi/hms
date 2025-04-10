<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <!-- Load CSS (Use asset() only for public files) -->
    <link rel="stylesheet" href="{{ asset('assets/css/main.css') }}"> 
    <!-- Vite for React -->
    @viteReactRefresh
    @vite(['resources/js/app.jsx'])

    @inertiaHead
</head>
<body>
    @inertia
</body>
</html>
