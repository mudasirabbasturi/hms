<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Department;
use Inertia\Inertia;

class DepartmentController extends Controller
{
    public function Index() {
        $departments = Department::select(
            'departments.id',
            'departments.parent_id',
            'departments.name',
            'departments.description',
            'parent.name as parent_name'
        )
        ->leftJoin('departments as parent', 'departments.parent_id', '=', 'parent.id')   
        ->get();
        return inertia::render('Components/Department/Index', ['departments' => $departments]);
    }

    public function Store( Request $request )
    {
        $validatedData = $request->validate([
            'parent_id' => 'nullable|exists:departments,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        $department = Department::create($validatedData);
        return redirect()->back()->with('message', 'Department added successfully!');
    }

    public function edit($id)
    {
        $department = Department::findOrFail($id);
        return response()->json($department);
    }

    public function Update(Request $request, $id)
    {
        $department = Department::findOrFail($id);
        $validatedData = $request->validate([
            'parent_id' => 'nullable|exists:departments,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);
        
        $department->update($validatedData);
        return back()->with('message', 'Department updated successfully!');
    }

    public function Destroy($id)
    {
        $department = Department::findOrFail($id);
        $department->delete();
        return back()->with('message', 'Department deleted successfully!');
    }
}
