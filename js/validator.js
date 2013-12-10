(function($) {
    $.fn.validate = function() {
        var v = new Validator($(this));        
        return v.validate();
    }
    
    $.fn.force_validate = function(name, message) {
        add_message($(this).find('input[name='+name+']'), message);
    }
    
    function add_message(el, message) {
        el.addClass('validation-wrong').after('<span class="validation-message help-inline">' + message + '</span>');
        el.closest('label').addClass('validation-wrong');
    }

    Validator = function(form) {
        this.form = form;
        this.status = true;
    }
    
    $.extend(Validator.prototype, {
        validate: function() {
            this.form.find('.validation-wrong').removeClass('validation-wrong');
            this.form.find('.validation-message').remove();
            this.form.find('input, textarea').each($.proxy(this, 'check'));
            return this.status;
        },
        
        check: function(i, item) {
            var el = $(item);
            var code = '_' + el.data('validation');
            var name = el.attr('title') || '';
            if (this[code]) {
                var result = this[code](el.val(), el);
                if (!result) {
                    this.status = false;
                    add_message(el, messages[code].replace('{name}', name));                    
                }
                
            }
        },
        
        _required: function(value, el) {
            return !(/^\s*$/.test(value));
        },
        
        _idn: function(value, el) {
            if (value.length < 1 || value.length > 10) return false;
            return /^[a-z0-9.]*$/.test(value); 
        },
        
        _email: function(value, el) {
            return /^[a-z\d](?:[\w\.-]*[a-z\d])*@(?:[a-z\d](?:[a-z\d-]*[a-z\d])*\.)+[a-z]{2,4}$/i.test(value);
        },
        
        _password: function(value, el) {
            return value.length > 5;
        },
        
        _link: function(value, el) {
            if (value.length == 0) { return true; }
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);                             
        },
        
        _username: function(value, el) {
            if (value.length == 0) { return true; }
            return /^[a-z0-9.]*$/.test(value);                             
        },  
        
        _required_link: function(value, el) {
            return /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/.test(value);                             
        }, 
        
        _required_length: function(value, el) {
            return value.length > 20;
        },             
        
        _num: function(value, el) {
            value = value * 1;
            if (isNaN(value)) return false;
            return !(el.data('min') * 1 > value || el.data('max') * 1 < value || (value * Math.pow(10, el.data('dec') * 1) != Math.floor(value * Math.pow(10, el.data('dec') * 1))));
        },
    });
    
    messages = {
        '_required': '{name} field must be filled in',
        '_email': 'Type in an email correctly',
        '_idn': 'use a-z, 0-9 and less than 10 symbols',
        '_password': 'Your password is too week. It must be at least 6 characters',
        '_link':'Необходимо ввести корректный url',
        '_required_link':'Необходимо ввести корректный url',
        '_username':'Type in correct username',
        '_required_length':'Поле {name} должно быть заполнено',
        '_num': 'Incorrect value'
    };    
})(jQuery);