<x-layout>
    <x-slot:title>
        Homepage
    </x-slot:title>

    <body class="antialiased" background="{{ asset('img/green-page-background.jpg') }}">

        <div class="container">
            <div class="row justify-content-center">
                <div class="col-lg-9">
                    <div class="text-center" id="gameDiv" >
                        @if(Auth::user() != true)
                        <script type="module" src="{{ asset('js/launch/launchGuestGame.js')}}"></script>
                            @else

                            <script type="module" src="{{ asset('js/launch/launchAuthGame.js') }}"></script>
                        @endif
                    </div>

                </div>
            </div>
        </div>

    </body>
</x-layout>
