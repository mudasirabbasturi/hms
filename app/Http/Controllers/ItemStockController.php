<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ItemStock;
use Inertia\Inertia;

class ItemStockController extends Controller
{
    public function Index ()
    {

        $ItemStocks = ItemStock::cursor();
        return inertia('Components/Inventory/ItemStock/Index', [
            'ItemStocks' => $ItemStocks,
        ]);

    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
        ]);
        ItemStock::create($validatedData);
        return redirect()->back()->with('message', 'ItemStock Added Successfully!');
    }

    public function Update (Request $request, $id)
    {

        $ItemStocks = ItemStock::findOrFail($id);
        $validatedData = $request->validate([
        ]);
        $ItemStocks->update($validatedData);
        return back()->with('message', 'ItemStock Updated Successfully!');

    }

    public function Destroy ($id)
    {

        $ItemStock = ItemStock::find($id);
        if ( $ItemStock ) {
            $ItemStock->delete();
            return redirect()->back()->with('message', 'ItemStock Deleted Successfully!');
        }
        else {
            return redirect()->back()->with('message', 'ItemStock Does Not Found!');
        }

    }
}
