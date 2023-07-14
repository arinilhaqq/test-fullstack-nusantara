<?php

namespace App\Http\Controllers;

use App\Models\Book;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Retrieve the authenticated user
        $user = auth()->user();
    
        // Retrieve the books owned by the user
        $books = $user->books;
    
        return response()->json($books);
    }
    

    public function store(Request $request)
    {
        // Get the authenticated user's ID
        $userId = $request->user()->id;
    
        // Create a new book with the associated user ID and request data
        $bookData = $request->all();
        $bookData['user_id'] = $userId;
        $book = Book::create($bookData);
    
        return response()->json([
            'message' => 'Book created',
            'book' => $book,
        ]);
    }


    /**
     * Update the specified resource in storage.
    */
    public function update(Request $request, $bookId)
    {
        // Find the book by ID
        $book = Book::findOrFail($bookId);
    
        // Get the authenticated user's ID
        $userId = $request->user()->id;
    
        // Check if the authenticated user owns the book
        if ($book->user_id !== $userId) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }
    
        // Update the book
        $book->update($request->except('user_id')); // Exclude user_id from the updated data
    
        // Refresh the book data to include the updated user_id
        $book->refresh();
    
        return response()->json([
            'message' => 'Book updated',
            'book' => $book,
        ]);
    }
    

    /**
     * Display the specified resource.
     */
    public function show(Request $request, $bookId)
    {
        // Get the authenticated user's ID
        $userId = $request->user()->id;

        // Find the book by ID and user_id
        $book = Book::where('id', $bookId)
                    ->where('user_id', $userId)
                    ->firstOrFail();

        return response()->json($book);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy($bookId)
    {
        // Find the book by ID
        $book = Book::findOrFail($bookId);

        // Delete the book
        $book->delete();

        return response()->json([
            'message' => 'Book deleted',
            'book' => $book,
        ]);
    }
}
