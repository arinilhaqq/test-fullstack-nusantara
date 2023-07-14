<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\BookController;
use App\Http\Controllers\UserController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Books
Route::middleware('auth:sanctum')->get('/books', [BookController::class, 'index']);
Route::middleware('auth:sanctum')->post('/books/add', [BookController::class, 'store']);
Route::middleware('auth:sanctum')->put('/books/{bookId}/edit', [BookController::class, 'update']);
Route::middleware('auth:sanctum')->get('/books/{bookId}', [BookController::class, 'show']);
Route::middleware('auth:sanctum')->delete('/books/{bookId}', [BookController::class, 'destroy']);

// User
Route::middleware('auth:sanctum')->get('/user', [UserController::class, 'show']);
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::middleware('auth:sanctum')->delete('/user/logout', [UserController::class, 'logout']);