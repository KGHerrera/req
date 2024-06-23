<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreFolioRequest;
use App\Models\Folio;
use Illuminate\Http\Request;

class FolioController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $folios = Folio::all();
        return response()->json($folios);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreFolioRequest $request)
    {
        $validatedData = $request->validated();
        $folio = Folio::create($validatedData);
        return response()->json(['message' => 'Folio creado con éxito.', 'folio' => $folio], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Folio $folio)
    {
        return response()->json($folio);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
