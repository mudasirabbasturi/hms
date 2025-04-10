<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Share;
use App\Models\Procedure;
use App\Models\User;

class ShareController extends Controller
{
    public function Index( Request $request, $id ) {
        $shares = Share::select('id','name','type','value')->where('user_id', '=', $id)->get();
        $procedures = Procedure::select('id', 'name')->get();
        $user = User::select('id','name')->where('id', $id)->first();
        return inertia('Components/Users/Share', [
            'shares' => $shares,
            'procedures' => $procedures,
            'user' => $user
        ]);
    }

    public function Store( Request $request, $id ) {
        $validatedData = $request->validate([
            'user_id' => 'required|exists:users,id',
            'procedure_id' => 'required|exists:procedures,id',
            'name' => 'required|string',
            'type' => 'required|string|in:percent,value',
            'value' => 'required|numeric',
        ]);
        $share = Share::create($validatedData);
        return redirect()->back()->with('message', 'Doctor Share Added Successfully');
    }

    public function Update( Request $request, $id ) {
        $share = Share::find($id);
        if (!$share) {
            return redirect()->back()->with('message', 'Doctor Share not found');
        }
        $share->update($request->only(['procedure_name', 'procedure_id', 'type', 'value']));
        return redirect()->back()->with('message', 'Doctor Share Updated Successfully!');
    }

    public function Destroy( Request $request, $id ) {
        $share = Share::find($id);
        if ($share) {
            $share->delete();
            return redirect()->back()->with('message', 'Doctor Share Deleted Successfully!');
        }
        return redirect()->back()->with('message', 'Doctor Share not found');
    }
}
