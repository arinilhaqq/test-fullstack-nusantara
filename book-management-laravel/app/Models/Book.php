<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Book extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'isbn',
        'title',
        'subtitle',
        'author',
        'published',
        'publisher',
        'pages',
        'description',
        'website',
    ];

    protected $casts = [
        'published' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}