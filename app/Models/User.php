<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;



class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'password',
        'gender',
        'phone',
        'departments',
        'designation',
        'qualification',
        'service',
        'awards',
        'expertise',
        'registrations',
        'professional_memberships',
        'languages',
        'experience',
        'degree_completion_date',
        'summary_pmdc',
        'profile',
        'type'
    ];

    protected static function boot()
    {
        parent::boot();
        static::creating(function ($user) {
            $latestUser = User::latest('id')->first();
            $nextId = $latestUser ? ((int) substr($latestUser->user_id, 4)) + 1 : 1;
            $user->user_id = 'HMS-' . str_pad($nextId, 5, '0', STR_PAD_LEFT);
        });
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

}
