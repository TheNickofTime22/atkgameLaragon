<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\Facades\Image;
use DateTime;

class ProfileController extends Controller

{
    public function index(){
        $elapsedTimes = [];


        $user = Auth::user();
        if($user->scores != null ){
            $scores = $user->scores;
            foreach ($scores as $score) {
                $createdAt = new DateTime($score->created_at); // Create a DateTime instance from the timestamp
                $now = new DateTime(); // Create a DateTime instance representing the current time
                $diff = $now->diff($createdAt); // Get the difference between the two dates as a DateInterval object

                // Format the output based on the difference between the two dates
                if ($diff->y > 0) {
                    $elapsed = $diff->y . ' year' . ($diff->y > 1 ? 's' : '') . ' ago';
                } elseif ($diff->m > 0) {
                    $elapsed = $diff->m . ' month' . ($diff->m > 1 ? 's' : '') . ' ago';
                } elseif ($diff->d > 0) {
                    $elapsed = $diff->d . ' day' . ($diff->d > 1 ? 's' : '') . ' ago';
                } elseif ($diff->h > 0) {
                    $elapsed = $diff->h . ' hour' . ($diff->h > 1 ? 's' : '') . ' ago';
                } elseif ($diff->i > 0) {
                    $elapsed = $diff->i . ' minute' . ($diff->i > 1 ? 's' : '') . ' ago';
                } else {
                    $elapsed = 'just now';
                }

                $elapsedTimes[] = $elapsed;
                }
        } else {
            $scores = null;
        }






        return view('profile', ['scores' => $scores, 'elapsedTimes' => $elapsedTimes]);
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
