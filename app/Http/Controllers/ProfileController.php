<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;

class ProfileController extends Controller

{
    public function index(){

        $user = Auth::user();
        if($user->scores != null ){
            $scores = $user->scores;
        } else {
            $scores = null;
        }

        if($user->friends != null){
            $friends = $user->friends;
        } else {
            $friends = null;
        }

        return view('profile', ['scores' => $scores, 'friends' => $friends]);
    }

    public function store(Request $request) {

        $request->validate([
            'pfp' => 'required|image|mimes:jpg,jpeg,png,gif,svg|max:2048'
        ]);

        $image_file = uniqid().'.'.$request->pfp->extension();
        $imgFile = Image::make($request->pfp->getRealPath());
        $imgFile->resize(150, 150, function($constraint) {
            $constraint->aspectRatio();
        });
        $imgFile->save(public_path('img/profile').'/'.$image_file);

        Auth::user()->update(['pfp' => $image_file]);

        $image_file2 = uniqid().'.'.$request->bannerImage->extension();
        $imgFile2 = Image::make($request->bannerImage->getRealPath());
        $imgFile2->resize(400, 150, function($constraint) {
            $constraint->aspectRatio();
        });
        $imgFile2->save(public_path('img/profile').'/'.$image_file2);

        Auth::user()->update(['bannerImage' => $image_file2]);

        return redirect()->back();
    }
}
