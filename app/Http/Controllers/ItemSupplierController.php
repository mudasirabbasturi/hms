<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemSupplier;
use Inertia\Inertia;

class ItemSupplierController extends Controller
{

    public function Index ()
    {

        $ItemSuppliers = ItemSupplier::cursor();
        return inertia('Components/Inventory/ItemSupplier/Index', [
            'ItemSuppliers' => $ItemSuppliers,
        ]);

    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
        ]);
        ItemSupplier::create($validatedData);
        return redirect()->back()->with('message', 'ItemSupplier Added Successfully!');
    }

    public function Update (Request $request, $id)
    {

        $ItemSuppliers = ItemSupplier::findOrFail($id);
        $validatedData = $request->validate([
        ]);
        $ItemSuppliers->update($validatedData);
        return back()->with('message', 'ItemSupplier Updated Successfully!');

    }

    public function Destroy ($id)
    {

        $ItemSupplier = ItemSupplier::find($id);
        if ( $ItemSupplier ) {
            $ItemSupplier->delete();
            return redirect()->back()->with('message', 'ItemSupplier Deleted Successfully!');
        }
        else {
            return redirect()->back()->with('message', 'ItemSupplier Does Not Found!');
        }

    }
    
}
