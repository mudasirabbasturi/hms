<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Manufacturer;
use Inertia\Inertia;

class ManufacturerController extends Controller
{

    public function Index ()
    {

        $manufacturers = Manufacturer::cursor();

        return inertia('Components/Inventory/Manufacturer/Index', [
            'manufacturers' => $manufacturers,
        ]);

    }

    public function Store (Request $request)
    {
        $validatedData = $request->validate([
        ]);
        Manufacturer::create($validatedData);

        return redirect()->back()->with('message', 'Manufacturer Added Successfully!');
    }

    public function Update (Request $request, $id)
    {

        $manufacturer = Manufacturer::findOrFail($id);
        $validatedData = $request->validate([
        ]);
        $manufacturer->update($validatedData);
        return back()->with('message', 'Manufacturer Updated Successfully!');

    }

    public function Destroy ($id)
    {

        $manufacturer = Manufacturer::find($id);
        if ( $manufacturer ) {
            $manufacturer->delete();
            
            return redirect()->back()->with('message', 'Manufacturer Deleted Successfully!');
        }
        else {
            return redirect()->back()->with('message', 'Manufacturer Does Not Found!');
        }

    }

}
