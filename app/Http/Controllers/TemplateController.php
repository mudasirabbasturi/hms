<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\User;
use App\Models\Department;
use App\Models\Template;

class TemplateController extends Controller
{
    public function Index()
    {
        $templates = Template::join('users', 'templates.user_id', '=', 'users.id')
            ->where('users.type', 'doctor')
            ->select('templates.*', 'users.name as doctor_name')
            ->orderBy('templates.created_at', 'desc')
            ->orderBy('templates.id', 'desc')
            ->get();
        $doctors = User::select('id', 'name')->where('type', 'doctor')->cursor();
        return inertia('Components/Template/Index', [
            'templates' => $templates,
            'doctors' => $doctors,
        ]);
    }

    public function Store(Request $request) 
    {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'name' => 'required|string|max:255',
            'show' => 'nullable|boolean',
            'choices' => 'nullable|array',
        ]);
        $template = Template::create($validatedData);
        return redirect()->back()->with('message', 'template added successfully!');
    }

    public function Update(Request $request, $id)
    {
        $template = Template::findOrFail($id);
        if ($request->all()) {
            $validatedData = $request->validate([
                'user_id' => 'required|exists:users,id',
                'name' => 'required|string|max:255',
                'show' => 'nullable|boolean',
                'choices' => 'nullable|array',
            ]);
            $template->update($validatedData);
            return redirect()->back()->with('message', 'Template updated successfully!');
        }
        return redirect()->back()->with('error', 'No data received for update.');
    }


    public function Destroy($id) {
        $template = Template::find($id);
        if ($template) {
            $template->delete();
            return redirect()->back()->with('message', 'Template deleted successfully!');
        }
        return redirect()->back()->with('message', 'Template not found');
    }

}
