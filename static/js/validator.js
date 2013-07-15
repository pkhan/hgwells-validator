

var validCodes = ['1234','2222'];

var Code = Backbone.Model.extend({
    defaults: {
        code: '',
        maxLen: 4
    },
    addOne: function(num) {
        var code = this.get('code');
        this.set('code', code + num);
        if(code.length === this.get('maxLen') - 1) {
           this.trigger('codeatmax', this.get('code'));
        }
    }
})

var App = Backbone.View.extend({
    el: '.my-container',
    events: {
        'touchend .num-pad .letter_box' : function(evt) {
            var $tgt = $(evt.currentTarget);
            this.addNum($tgt.text());
            $tgt.css({
                'background-color' : 'white'
            });
            _.delay(function() {
                $tgt.css({
                    'background-color' : ''
                });
            }, 300);
        }
    },
    initialize: function() {
        var app = this;
        this.timeout = 0;
        this.paused = false;
        this.code = new Code();
        this.listenTo(this.code, 'codeatmax', function(code) {
            this.validate(code);
        });
        this.listenTo(this.code, 'change:code', function(c, code) {
            var boxes = this.$display.find('span').text('');
            _.each(code, function(num, index) {
                boxes.eq(index).text(num);
            });
        });
    },
    render: function() {
        this.$message = this.$('.status span');
        this.$display = this.$('.display');
        this.$numpad = this.$('.num-pad');
        return this;
    },
    addNum: function(num) {
        if(this.paused) {
            this.reset();
        }
        this.code.addOne(num);
    },
    validate: function(code) {
        if(_.indexOf(validCodes, code) > -1) {
            this.$message.text('CORRECT')
            .removeClass('wrong');
        } else {
            this.$message.text('WRONG')
            .addClass('wrong');
        }
        this.pause();
    },
    pause: function() {
        var app = this;
        this.paused = true;
        this.timeout = window.setTimeout(function() {
            app.reset();
        }, 3000);
    },
    reset: function() {
        var app = this;
        app.code.set('code', '');
        app.$message.html('&nbsp;');
        this.paused = false;
        window.clearTimeout(this.timeout);
    }
});

$(document).ready(function() {
    var app = new App();
    app.render();
    window.app = app;
});