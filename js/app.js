var csrftoken = $('meta[name="csrf-token"]').attr('content');
var websocket = $('meta[name="websocket"]').attr('content');
var lang = $('meta[name="language"]').attr('content');
var themecolor = $('meta[name="themecolor"]').attr('content');
var logged = $('meta[name="logged"]').attr('content') === '1';
var steamid = $('meta[name="steamid"]').attr('content');
var username = $('meta[name="username"]').attr('content');
var avatar = $('meta[name="avatar"]').attr('content');
var token = $('meta[name="token"]').attr('content');
var time = $('meta[name="time"]').attr('content');
var game = $('meta[name="game"]').attr('content');
var tradeURL = $('meta[name="tradeURL"]').attr('content');

$.ajaxSetup({ headers: { 'X-CSRF-TOKEN': csrftoken } });

var socket = io(websocket);

socket.emit('init', {
    lang: lang,
    game: game,
    logged: logged,
    steamid: steamid,
    username: username,
    avatar: avatar,
    token: token,
    time: time
});

function notify(type, message) {
    var color = '#0c0c0c';
    if (type === 'error') {
        color = '#de3a3a';
    } else if (type === 'success') {
        color = '#35ae35';
    }

    $.amaran({
        content:{
            bgcolor: color,
            color:'#fff',
            message: message
        },
        theme:'colorful',
        position: 'bottom right',
        inEffect: 'slideRight',
        outEffect: 'slideRight',
        delay: 8000
    });
}

function showTradeOffer(tradeOfferID) {
    var winOffer = window.open('https://steamcommunity.com/tradeoffer/'+ tradeOfferID+'/','','height=1120,width=1028,resize=yes,scrollbars=yes');
    winOffer.focus();
}

var Helpers = {
  generateItemHTML: function (item, price) {
      return '<div class="shop__inventory__item item ' + (price ? price : "junk") + '"  data-id="' + item.id + '" data-market-hash-name="' + (typeof item.market_name != "undefined" ? item.market_name : item.market_hash_name) + '" data-price="' + (price ? price : 0) + '" data-bot="' + item.bot_id + '">' +
          '<div class="shop__inventory__item__top"><span>' + (price ? price : "Junk") + '</span></div> ' +
          '<span class="shop__inventory__item__name">' + (typeof item.market_name != "undefined" ? item.market_name : item.market_hash_name) + '</span> ' + 
          '<img src="https://steamcommunity-a.akamaihd.net/economy/image/class/730/' + item.classid + '/190fx86f" alt="CSGO weapon"/> ' +
      '</div>';
  },
    addZero: function(x) {
        return x < 10 ? '0' + x : x;
    },
    getHour: function(time) {
        var date = new Date(time);
        return this.addZero(date.getHours()) + ":" + this.addZero(date.getMinutes());
    }
};

var _soundOn = true;

$(function(){
    var siteToggle = {
        $nav: $("nav"),
        $chat: $(".chat"),
        $container: $(".container"),
        $freeCoinsArea: $("nav .free-coins-area"),
        $giveawayArea: $("nav .giveaway-area"),
        $loginArea: $('nav .navbar-player'),
        $chatToggle: $(".chat-toggle-button"),
        $chatToggleShow: $(".chat-toggle-button-green"),
        $menuToggle: $(".menu-toggle-button"),
        $menuEmptySpace: $("nav .empty-space"),
        $soundToggle: $(".sound-toggle-button"),
        $main: $("main"),
        _animateDuration: 600,
        $balance: $("nav .balance"),
        $balanceValue: $("nav .balance .value"),
        changeMenuSize: function() {
           //in css

            this.resize();
        },
        menuToggle: function() {
            if (this.$nav.hasClass("part-hide")) {
                this.$nav.removeClass("part-hide");
                this.$menuToggle.find('i').attr('class', 'fa fa-arrow-left');
                this.$container.removeClass("menu-part-hide");
                localStorage.setItem("toggleMenu", "show");
            } else {
                this.$nav.addClass("part-hide");
                this.$menuToggle.find('i').attr('class', 'fa fa-arrow-right');
                this.$container.addClass("menu-part-hide");
                localStorage.setItem("toggleMenu", "hide");
            }
            this.changeMenuSize();
            this.balance();
            this.crash();
        },
        crash: function () {
            if (typeof crash != "undefined") {
                $("<div />")
                    .css("step",1)
                    .animate({
                        step: siteToggle._animateDuration
                    }, {
                        duration: siteToggle._animateDuration,
                        step: function () {
                            crash.resize();
                        }
                    });
            }
        },
        chatToggle: function () {
            if (this.$chat.hasClass("part-hide")) {
                this.$chat.removeClass("part-hide");
                this.$chatToggle.find('i').attr('class', 'fa fa-arrow-left');
                this.$container.removeClass("chat-part-hide");
                localStorage.setItem("toggleChat", "show");
            } else {
                this.$chat.addClass("part-hide");
                this.$chatToggle.find('i').attr('class', 'fa fa-arrow-right');
                this.$container.addClass("chat-part-hide");
                localStorage.setItem("toggleChat", "hide");
            }

            this.crash();
        },
        soundToggle: function () {
            if (_soundOn) {
                this.$soundToggle.find('i').attr('class', 'fa fa-volume-off');
                localStorage.setItem("toggleSound", "hide");
                _soundOn = false;
            } else {
                this.$soundToggle.find('i').attr('class', 'fa fa-volume-up');
                localStorage.setItem("toggleSound", "show");
                _soundOn = true;
            }
        },
        resize: function () {
            this.$nav.css('left', -1*$(window).scrollLeft());
            this.$nav.scrollTop(this.$main.scrollTop()+this.$container.scrollTop()+$("body").scrollTop());
            this.$main.css('min-height', $(this.$nav)[0].scrollHeight-92);
        },
        init: function () {
            $(window).resize(this.resize.bind(this));
            $(window).scroll(this.resize.bind(this));
            this.$main.scroll(this.resize.bind(this));
            this.$container.scroll(this.resize.bind(this));
            siteToggle.resize();

            var body = $("body");
            body.addClass("offToggleTransition");
            this.$menuToggle.click(this.menuToggle.bind(this));
            this.$chatToggle.click(this.chatToggle.bind(this));
            this.$soundToggle.click(this.soundToggle.bind(this));
            this.$chatToggleShow.click(this.chatToggle.bind(this));
            if (localStorage.getItem("toggleMenu")=="hide") this.menuToggle();
            if (localStorage.getItem("toggleChat")=="hide") this.chatToggle();
            if (localStorage.getItem("toggleSound")=="hide") this.soundToggle();
            setTimeout(function() {
                body.removeClass("offToggleTransition");
            }, 1);
            this.changeMenuSize();
        },
        balance: function () {
            return;
            if (this.$nav.hasClass("part-hide")) {
                this.$balanceValue.css("font-size", (19-this.$balanceValue.text().length)+"px");
            } else {
                this.$balanceValue.css("font-size", "20px");
            }
        }
    };
    siteToggle.init();

    function popup() {
        var $div = $(".popup");
        if ($div.css("display")=="block") {
            $div.fadeOut(300);
        } else {
            $div.fadeIn(300);
        }
    }

    $(".chat-info").click(popup);
    $(".popup-close").click(popup);



    var actual_href = $(".navbar-pages a[href='"+(location.href[location.href.length-1]=="/"?location.origin:location.href)+"']");
    actual_href.addClass("active");
    var balance = $('.balance');
    var balanceValue = $('.value', balance);

    $('#steam-id-copy').click(function(){
        var copyTextarea = document.querySelector('#steam-id');
        copyTextarea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            notify(successful?'success':'error', 'Copying text command was ' + msg);
        } catch (err) {
            notify('error','Oops, unable to copy');
        }
    });

    $("#trade-url-send").click(function(){
        var token_regex = /token=([\w-]+)/.exec($("#trade-url").val());
        if (token_regex) {
            var token = token_regex[1];
            socket.emit('trade token', token);
        }
    });

    socket.on('users online', function(count) { $('.players-online').text(count); });

    socket.on('notify', function(type, message, data) {
        if (locale[message]) message = locale[message];
        data = data || [];
        notify(type, vsprintf(message, data));
    });

    socket.on('balance change', function(value) {
        balance.data('balance', parseInt(balance.data('balance')) + value);
        balanceValue.html(balance.data('balance'));
        siteToggle.balance();
    });

    window.bal = function (value) {
        balance.data('balance', parseInt(balance.data('balance')) + value);
        balanceValue.html(balance.data('balance'));
        siteToggle.balance();
    }

});


Number.prototype.parseValue = function() {
    return this.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1,");
};