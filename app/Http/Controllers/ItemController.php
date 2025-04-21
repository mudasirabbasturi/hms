<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function Index ()
    {

        $items = Item::cursor();

        return inertia('Components/Inventory/Item/Index', [
            'items' => $items,
        ]);

    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
        ]);
        Item::create($validatedData);

        return redirect()->back()->with('message', 'Item Added Successfully!');
    }

    public function Update (Request $request, $id)
    {

        $items = Item::findOrFail($id);
        $validatedData = $request->validate([
        ]);
        $items->update($validatedData);
        return back()->with('message', 'Item Updated Successfully!');

    }

    public function Destroy ($id)
    {

        $item = Item::find($id);
        if ( $item ) {
            $item->delete();
            
            return redirect()->back()->with('message', 'Item Deleted Successfully!');
        }
        else {
            return redirect()->back()->with('message', 'Item Does Not Found!');
        }

    }
}
