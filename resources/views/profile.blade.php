<<x-layout>
    <x-slot:title>
        profile
    </x-slot:title>





    <div class="container-fluid">
        <div class="row mt-4 bannerHolder" style="background-image:url({{ asset('img/profile/'.Auth::user()->bannerImage) }})">
            <div class="col-2">
                {{-- Click this button to change profile image and banner --}}
                <img src="{{ asset('img/edit-circle.png') }}" alt="edit" class="imgEditBtn" onclick="editImage();">
                <img src="{{ asset("img/profile/".Auth::user()->pfp) }}" alt="Profile Image" class="profile-image">

            </div>


        </div>
        <div class="modal fade" id="editImageModal" tabindex="-1" aria-labelledby="editImageLabel" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content" style="background-color:gray;">
                    <div class="modal-header">
                        <h5 class="modal-title" id="editImageTitle">Edit your profile picture</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-6"><img src="{{ asset("img/profile/".Auth::user()->pfp) }}" class="Profile Image"
                                    alt="">
                                </div>
                            <div class="col-6">
                                <div>
                                    <form action="{{ route('store') }}" method="POST" enctype="multipart/form-data">
                                        @csrf
                                        @method('POST')
                                    <label class="form-label" for="input_file">Choose Profile Image</label>
                                    <input type="file" class="form-control" id="input_file" name="pfp" placeholder="Image">

                                        <hr>
                                    <label class="form-label" for="input_file">Choose Banner Image</label>
                                    <input type="file" class="form-control" id="input_file2" name="bannerImage" placeholder="Image">
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="submit" class="btn btn-primary">Save changes</button>
                    </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="row mt-4">
            <div class="col-3 offset-4">
                <h1 class="">{{Auth::user()->screenname}}</h1>
            </div>
            <div class="col-2">
                {{-- Click this button to be directed to a page to change all information.   --}}
                <button class="btn btn-primary">
                    edit
                </button>
                <button class="btn btn-primary">
                    settings
                </button>
            </div>


        </div>
        <div class="row m-4">
            <div class="col-4 offset-1 text-center " style="background-color: gray">
                <div class="container ">
                    <div class="row">

                        <h3 class=""><u>Scores</u></h3>
                    </div>
                    <div class="row mt-4">
                        <table class="table table-hover table-nowrap">
                            <thead>
                                <th>Mode</th>
                                <th>Score</th>
                                <th>Days Since</th>
                            </thead>
                            <tbody>

                                @if($scores != null)
                                @foreach ($scores as $score)
                                <tr>
                                    <td>
                                        <h4 class="text-heading font-semibold" href="#">
                                            {{$score->GameMode}}
                                        </h4>

                                    </td>
                                    <td>
                                        <h4 class="text-heading font-semibold" href="#">
                                            {{$score->score}}
                                        </h4>
                                    </td>
                                    <td>
                                        <h4 class="text-heading font-semibold" href="#">
                                            {{$score->daysSince}}
                                        </h4>

                                    </td>

                                </tr>
                                @endforeach
                                @endif
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            <div class="col-4 offset-1 text-center " style="background-color: gray">
                <div class="container ">
                    <div class="row">
                        <h3 class=""><u>Friends</u></h3>

                    </div>
                    <div class="row mt-4">
                        <table class="table table-hover table-nowrap">

                            <tbody>
                                @if($friends != null)
                                @foreach($friends as $friend)
                                <tr>
                                    <td>
                                        <img alt="..." src="{{ asset('img/profile/'.$friend->pfp) }}"
                                            class="rounded-circle"
                                            style=" width: 50px;height: 50px;border-radius: 50%;box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;">

                                    </td>
                                    <td>
                                        <h4 class="text-heading font-semibold" href="#">
                                            {{$friend->screenname}}
                                        </h4>
                                    </td>

                                    <td>
                                        <button class="btn btn-warning">view</button>
                                        <button class="btn btn-warning mx-1">fight</button>
                                        <button class="btn btn-warning mx-1">del</button>
                                    </td>

                                </tr>
                                @endforeach
                                @endif


                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <!-- Bootstrap JS -->


    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>



    <script>
        function editImage() {
            // Get the modal element
            var modal = document.getElementById("editImageModal");

            // Show the modal
            var editImageModal = new bootstrap.Modal(modal, {
                keyboard: false
            })
            editImageModal.show();
        }
    </script>
</x-layout>
