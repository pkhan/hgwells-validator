

var validCodes = ['1234','2222'];

var Code = Backbone.Model.extend({
    defaults: {
        code: '',
        maxLen: 4
    },
    addOne: function(num) {
        var code = this.get('code');
        if(code.length === this.get('maxLen') - 1) {
           this.trigger('codeatmax', this.get('code'));
        }
        this.set('code', code + num);
    }
})

var App = Backbone.View.extend({
    el: '.container',
    events: {
        'click .num-pad button' : function(evt) {
            this.addNum($(evt.target).text());
        }
    },
    initialize: function() {
        var app = this;
        this.code = new Code();
        this.listenTo(this.code, 'codeatmax', function(code) {
            this.validate(code);
        });
        this.listenTo(this.code, 'change:code', function(c, code) {
            var boxes = this.$display.find('span');
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
    }
});

$(document).ready(function() {
    var app = new App();
    app.render();
    window.app = app;
});