<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Supplier;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function Index ()
    {

        $suppliers = Supplier::cursor();
        return inertia('Components/Inventory/Supplier/Index', [
            'suppliers' => $suppliers,
        ]);

    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
        ]);
        Supplier::create($validatedData);
        return redirect()->back()->with('message', 'Supplier Added Successfully!');
    }

    public function Update (Request $request, $id)
    {

        $suppliers = Supplier::findOrFail($id);
        $validatedData = $request->validate([
        ]);
        $suppliers->update($validatedData);
        return back()->with('message', 'Supplier Updated Successfully!');

    }

    public function Destroy ($id)
    {

        $supplier = Supplier::find($id);
        if ( $supplier ) {
            $supplier->delete();
            return redirect()->back()->with('message', 'Supplier Deleted Successfully!');
        }
        else {
            return redirect()->back()->with('message', 'Supplier Does Not Found!');
        }

    }
}
