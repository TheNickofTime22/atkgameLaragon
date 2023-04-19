<<x-layout>
    <x-slot:title>
        profile
    </x-slot:title>





    <div class="container-fluid">
        <div class="row mt-4 bannerHolder">
            <div class="col-2">
                {{-- Click this button to change profile image and banner --}}
                <img src="{{ asset('img/edit-circle.png') }}" alt="edit" class="imgEditBtn" onclick="editImage();">
                <img src="{{ asset(Auth::user()->pfp) }}" alt="Profile Image" class="profile-image">

            </div>
            <div class="col-4">
                <h1 style="margin-left: 30px"> {{Auth::user()->pfp}} Testing</h1>
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
                            <div class="col-6"><img src="{{ asset(Auth::user()->pfp) }}" class="Profile Image"
                                    alt="pfp">
                                </div>
                            <div class="col-6">
                                <div>
                                    <form action="{{ route('store') }}" method="POST" enctype="multipart/form-data">
                                        @csrf
                                        @method('POST')
                                    <label class="form-label" for="input_file">Choose file</label>
                                    <input type="file" class="form-control" id="input_file" name="pfp" placeholder="Image">
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
            <form action="{{ route('edit') }}">

            <div class="col-3 offset-4">
                <label for="screenname">Screenname</label>
                <input type="text" name="screenname" value="{{Auth::user()->screenname}}">

                </form>
            </div>



        </div>

    </div>

    <!-- Bootstrap JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous">
    </script>


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

    </div>
    </div>
</x-layout>
