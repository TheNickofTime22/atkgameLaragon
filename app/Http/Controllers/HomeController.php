<?php

namespace App\Http\Controllers;

use App\Models\Scores;
use Illuminate\Support\Facades\Auth;

use Illuminate\Http\Request;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //$this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        return view('home');
    }

    public function profile(){
        return view('profile');
    }

    public function getUser() {

        $user = Auth::user();
        return $user;
    }

    public function saveScore(Request $request) {
        $userId = $request->input('user_id');
        $gameMode = $request->input('GameMode');
        $score = $request->input('score');

        $score = new Scores([
            'user_id' => $userId,
            'GameMode' => $gameMode,
            'score' => $score,
        ]);


        $score->save();

        return response()->json(['message' => 'Score saved successfully!']);
    }


}
