<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Department;
use App\Models\ShareProcedure;
use Illuminate\Support\Facades\Storage;

use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // User main index
    public function Index( Request $request, $type ) {
        $departments = Department::cursor();
        if($type === "all") {
            $users = User::cursor();
        }
        else {
            $users = User::where('type', $type)->cursor();
        }
        return inertia('Components/Users/Index', [
            'users' => $users,
            'departments' => $departments,
            'type' => $type
        ]);
    }

    // Store user
    public function Store( Request $request ){
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'gender' => 'nullable|in:male,female,other',
            'phone' => 'nullable|string|max:15',
            'departments' => 'nullable|string',
            'designation' => 'nullable|string',
            'qualification' => 'nullable|string',
            'service' => 'nullable|string',
            'awards' => 'nullable|string',
            'expertise' => 'nullable|string',
            'registrations' => 'nullable|string',
            'professional_memberships' => 'nullable|string',
            'languages' => 'nullable|string',
            'experience' => 'nullable|string',
            'degree_completion_date' => 'nullable|date',
            'summary_pmdc' => 'nullable|string',
            'profile' => 'nullable|string',
            'type' => 'nullable|string',
        ]);
        $validatedData['password'] = Hash::make($validatedData['password']);
        $user = User::create($validatedData);
        return redirect()->route('user.index', ['type' => $validatedData['type']])
        ->with('message', 'User added successfully!');
    }

    // Show user
    public function Show($id) {
        $user = User::find($id);
        $departments = Department::cursor();
        $profile = Storage::url($user->profile);
        return inertia('Components/Users/Show', [
            'user' => $user, 
            'departments' => $departments,
            'profile' => $profile
         ]);
    }

    // update single column data 
    public function updateSingleColumn(Request $request, $id) {
        $validatedData = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255|unique:users,email,'.$id,
            'password' => 'sometimes|required|string|min:8',
            'gender' => 'nullable|in:male,female,other',
            'phone' => 'nullable|string|max:15',
            'departments' => 'nullable|string',
            'designation' => 'nullable|string',
            'qualification' => 'nullable|string',
            'service' => 'nullable|string',
            'awards' => 'nullable|string',
            'expertise' => 'nullable|string',
            'registrations' => 'nullable|string',
            'professional_memberships' => 'nullable|string',
            'languages' => 'nullable|string',
            'experience' => 'nullable|string',
            'degree_completion_date' => 'nullable|date',
            'summary_pmdc' => 'nullable|string',
            'profile' => 'nullable|string',
            'type' => 'nullable|string',
        ]);
    
        $user = User::findOrFail($id);
        $user->update($validatedData);
        return back()->with('message', 'User updated successfully!');
    }
    
    // update profile 
    public function updateProfile(Request $request, $id) {
        $validatedData = $request->validate([
            'profile' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);
        if ($request->hasFile('profile')) {
            $imagePath = $request->file('profile')->store('profiles', 'public'); 
            $validatedData['profile'] = $imagePath; 
        }
        $user = User::findOrFail($id);
        $user->update($validatedData);
        return back()->with('message', 'Profile updated successfully!');
    }

    // Destroy User
    public function Destroy($id)
    {
        $user = User::find($id);
        if ($user) {
            $user->delete();
            return redirect()->back()->with('message', 'User deleted successfully!');
        }
        return redirect()->back()->with('message', 'User not found');
    }

}