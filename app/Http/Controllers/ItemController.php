<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Item;
use App\Models\Category;
use App\Models\Manufacturer;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class ItemController extends Controller
{
    public function Index()
    {
        $items = DB::table('items')
            ->leftJoin('categories', 'items.category_id', '=', 'categories.id')
            ->leftJoin('manufacturers', 'items.manufacturer_id', '=', 'manufacturers.id')
            ->select(
                'items.*',
                'categories.name as category_name',
                'manufacturers.name as manufacturer_name'
            )
            ->orderByDesc('created_at')
            ->orderByDesc('id')
            ->cursor();
        $categories = Category::cursor();
        $manufacturers = Manufacturer::cursor();
        return inertia('Components/Inventory/Item/Index', [
            'items' => $items,
            'categories' => $categories,
            'manufacturers' => $manufacturers,
        ]);
    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255|unique:items,barcode',
            'category_id' => 'nullable|exists:categories,id',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'unit' => 'required|string|max:50',
            'reorder_level' => 'nullable|integer|min:0',
        ]);
        Item::create($validatedData);
        return redirect()->back()->with('message', 'Item Added SuccessFully!');
    }

    public function Update (Request $request, $id)
    {

        $items = Item::findOrFail($id);
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255|unique:items,barcode,' . $items->id,
            'category_id' => 'nullable|exists:categories,id',
            'manufacturer_id' => 'nullable|exists:manufacturers,id',
            'unit' => 'required|string|max:50',
            'reorder_level' => 'nullable|integer|min:0',
        ]);
        $items->update($validatedData);
        return back()->with('message', 'Item Updated SuccessFully!');

    }

    public function Destroy ($id)
    {
        $item = Item::findOrFail($id);
        $item->delete();
        return back()->with('message', 'Item Deleted SuccessFully!');
    }
}
