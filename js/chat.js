
$(function() {
    "use strict";

    //FIXME: Remove global variable - need to edit admin scripts
    window.chat = {
        $div: $(".chat"),
        _input: $(".chat__sending__msg"),
        $send: $(".chat__sending__send"),
        $area: $(".chat__area"),
        _lastMessage: 0,
        _chatCooldown: 2,
        _maxMessages: 25,
        _messages: [],
        updateDisplay: function() {
            this.$area.empty();
            this._messages.forEach(function(item) {
                this.displayMessage(item, true);
            }.bind(this));
            //this.$area.animate({
             //   scrollTop: this.$area[0].scrollHeight
            //}, 0);
        },
        displayMessage: function(item, bypass) {
            var scroll = true;

            if (this.$area.children().length >= this._maxMessages) {
                this.$area.children().first().remove();
                scroll = false;
            }

            if (typeof item.message != 'undefined') {
                item.message = this.emots.rep(item.message);
            }

            if (item.hasOwnProperty('profile')) {
                $('<div class="chat__area__message" data-uniqueid="' + item.uniqueID + '" data-id="' + item.profile.steamid + '" data-username="' + item.profile.username + '"> ' +
                    '<img src="' + item.profile.avatar + '">' +
                   
                    '<div class="chat__area__message--box"> ' +
                     '<h3><a target="_blank" href="//steamcommunity.com/profiles/' + item.profile.steamid + '">' + item.profile.username + '</a></h3>' +
                    '<p>' + item.message + '</p>' +
                    '</div></div>').hide().appendTo(this.$area).fadeIn(500);
            } else if (item.hasOwnProperty('custom')) {
                $('<div class="chat-message"> ' +
                    '<div class="avatar"><img src="/img/avatar.jpg"> </div> ' +
                    '<div class="message"> ' +
                    '<div class="nickname siteAdmin">SkinUP.gg</div> ' +
                    '<div class="text">' + vsprintf((item.custom.messageCode && locale.hasOwnProperty(item.custom.messageCode) ? locale[item.custom.messageCode] : this.emots.rep(item.custom.message)), item.custom.variables || []) + '</div>' +
                    ' </div> ' +
                    '</div>').hide().appendTo(this.$area).fadeIn(500);
            }

            if (!bypass) {
                if (scroll) {
                    this.$area.animate({scrollTop: this.$area[0].scrollHeight}, 1500, 'easeInQuart');
                } else {
                    this.$area.animate({scrollTop: this.$area[0].scrollHeight}, 0);
                }
            }
        },
        addChat: function(profile, message, uniqueID, time) {
            if (this._messages.length >= this._maxMessages) this._messages.shift();
            var msg = {profile: profile, message: message, uniqueID: uniqueID, time: time};
            this._messages.push(msg);
            this.displayMessage(msg);
        },
        addCustom: function(message, messageCode, variables) {
            if (this._messages.length >= this._maxMessages) this._messages.shift();
            var msg = {custom: {message: message, messageCode: messageCode, variables: variables}};
            this._messages.push(msg);
            this.displayMessage(msg);
        },
        send: function () {
            this.sendMessage(this._input.val());
        },
        sendMessage: function(message) {
            if (message === '') return;
            if (this._lastMessage > (Date.now() - this._chatCooldown * 1000)) {
                notify('error', vsprintf(locale.chatCooldown, [((this._lastMessage - (Date.now() - (this._chatCooldown * 1000))) / 1000).toFixed(1)]));
                return;
            }
            this._input.val('');
            this._lastMessage = Date.now();
            socket.emit('chat message', {'type': 'chat', 'message': message});
        },
        emots: {
            parent: false,
            _list: "facepalm|heart|hi|isaac|kappa|sad1|sad2|sad3|sad4|sad5|sad6|smile1|smile2|smile3|smile4|sunglasses|tongue1|tongue2",
            $button: $(".emots-button"),
            $emots: $(".emots"),

            emotsToggle: function() {
                if (this.$emots.css('display')=="none") {
                    this.$emots.fadeIn(300);
                } else {
                    this.$emots.fadeOut(300);
                }
            },
            rep: function (txt) {
                return txt;

                return txt.replace(new RegExp(":("+this._list+"):",'gi'), function(emote) {
                    return '<img class="emote" src="/img/emotes/' + emote.toLowerCase().split(":").join("") + '.png">';
                });
            },
            init: function () {
                this.$button.click(this.emotsToggle.bind(this));
                this._list.split('|').forEach(function(emote) {
                    $('<div class="emote" data-val="'+emote+'"><img src="/img/emotes/'+emote+'.png"></div>')
                        .click(function(e) {
                            this.$emots.fadeOut(300);
                            this.parent._input.val( this.parent._input.val() + ' :' + $(e.currentTarget).data('val')+': ').focus();
                        }.bind(this))
                        .appendTo(this.$emots);
                }.bind(this));
            }
        },
        init: function () {
            this.emots.parent = this;
            //this.emots.init();

            socket.on('chat', function(messages) {
                this._messages = messages;
                this.updateDisplay();
            }.bind(this));
            socket.on('chat message', function(data) {
                this.addChat(data.profile, data.message, data.uniqueID, data.time);
            }.bind(this));
            socket.on('chat custom message', function(data) {
                this.addCustom(data.message, data.messageCode, data.variables);
            }.bind(this));

            this._input.on('keypress', function(e) {
                if (e.keyCode == 13)
                    return this.send() && false;
            }.bind(this));
            this.$send.click(this.send.bind(this));
        }
    };

    chat.init();

    $('html').contextMenu({
        selector: '.chat-message',
        transition: {
            speed: 300, // In milliseconds
            type: 'slideLeft'
        },
        position: {
            my: 'right top-25',
            at: 'left'
        },
        partner: this,
        items: function(e) {
            var user = $(e.target).closest('.chat-message');
            if (!user.data('id')) return;
            return [
                {type: 'title', text: user.data('username')},
                {type: 'item', text: locale.sendCoins, click: function() {
                    chat._input.val('/send ' + user.data('id') + ' ').focus();
                }},
                {type: 'item', text: locale.visitProfile, click: function() {
                    var win = window.open('http://steamcommunity.com/profiles/' + user.data('id'), '_blank');
                    win.focus();
                }}
            ]
        }
    });
});