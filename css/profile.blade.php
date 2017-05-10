@extends('layout')

@section('main-content')
    <div class="my-profile">
        <div class="topbg">
            <div class="box-label"><img src="{{ asset("img/icons/profile.png") }}"> Your profile</div>
            <div class="box">
                <label for="trade-url">Trade Link <a target="_blank" href="https://steamcommunity.com/id/darrefull/tradeoffers/privacy#trade_offer_access_url">(Find it here)</a></label>
                <div class="group-input">
                    <input type="text" id="trade-url" placeholder="Enter Your trade URL" value="@if(Auth::check()){{ Auth::user()->tradeURL() }}@endif"> <button id="trade-url-send">SAVE</button>
                </div>
            </div>
            <div class="box">
                <label for="steam-id">Your SteamID</label>
                <div class="group-input">
                    <input type="text" id="steam-id" readonly value="@if(Auth::check()){{ Auth::user()->id }}@endif"> <button id="steam-id-copy">COPY</button>
                </div>
            </div>
        </div>
        <div class="over-table">
            <div class="box-label"><img src="{{ asset("img/icons/won.png") }}"> History won</div>
            <div class="table">
                <table class="transaction-table display" style="width: 100%">
                    <thead>
                    <tr><th>GAME NUMBER</th><th>TOTAL ITEMS</th><th>YOUR CHANCE</th><th>REWARD</th><th>DATE</th></tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
        <div class="over-table">
            <div class="box-label"><img src="{{ asset("img/icons/latest-transactions.png") }}"> Latest transactions</div>
            <div class="table">
                <table class="transaction-table display" style="width: 100%">
                    <thead>
                    <tr><th>GAME NUMBER</th><th>TOTAL ITEMS</th><th>YOUR CHANCE</th><th>REWARD</th><th>DATE</th></tr>
                    </thead>
                    <tbody>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
@endsection

@section('scripts')
    <script type="text/javascript" src="/js/profile.js"></script>
@endsection