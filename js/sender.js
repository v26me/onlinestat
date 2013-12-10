(function($) {
    $.fn.sender = function(options) {
        var options = $.extend({
            action: 'update',
            file_submit: false
        }, options);
        if (options.callback) options.action = 'callback';
        
        return new Sender($(this), options);
    }
    
    Sender = function(form, options) {
        this.form = form;
        this.check = false;
        this.options = options;
        this.form.find('.sender').click($.proxy(this, 'send'));
        this.form.bind('submit', $.proxy(this, 'send'));
        $('<input />').attr({'type':'submit', 'class':'hide'}).appendTo(this.form);
        
        this.ready_status = true;
    }
    
    $.extend(Sender.prototype, {
        send: function(event) {
            event.preventDefault();
            if (!this.ready_status) return;
            
            if (this.options.pre_validate) {
                if (!this.options.pre_validate()) return;
            }
            
            if (!this.form.validate()) return;
            
            if (this.options.file_submit) {
                var flag = false;
                this.form.find('input[type="file"]').each(function(i, el){if ($(el).val()) {flag=true;}});
                if (flag) {
                    this.form.attr('method', 'post')
                        .attr('action', '/s/' + this.options.url)
                        .attr('enctype', 'multipart/form-data')
                        .unbind('submit').submit();
                        return;
                 }
            }
            
            if (this.options.check_url && !this.check) {
                this.lock();
                this.check_request();
            }
            else {
                this.lock();
                this.request();
            }
        },
        
        check_request: function() {
            if (this.options.check_url == 'true') {
                this.oncheck({status: true});
                return;
            }            
            $.request(this.options.check_url, this.form.serialize(), this.oncheck, this);
        },
        
        request: function() {
            $.request(this.options.url, this.form.serialize(), this.success, this);
        },
        
        lock: function() {
            this.ready_status = false;
        },
        
        unlock: function() {
            this.ready_status = true;    
        },
        
        oncheck: function(data) {
            if (data.status) {
                this.form.attr('method', 'post')
                         .attr('action', '/s/' + this.options.url)
                         .attr('enctype', 'multipart/form-data')
                         .unbind('submit').submit();
            }
            else {
                this.success(data);
            }
        },
        
        success: function(data) {
            if (data.status) {
                var action = (data.action)? data.action : this.options.action;
                
                var s = 'location:';
                if (action.indexOf(s) === 0) {
                    window.location.href = action.substr(s.length)
                    return;
                }
                
                switch (action) {
                    case 'replace':
                        this.form.children().not('.alert-message').remove();
                        this.form.addClass('replaced');
                    case 'update':       
                        this.form.find('.alert-message').removeClass('error').show().html(data.message);                 
                        break;
                    case 'reload':
                        location.reload(); return;
                        break;
                    case 'callback':
                        this.options.callback(data);
                }
               
            }
            else {
                if (data.field) {
                    this.form.force_validate(data.field, data.message);
                }
                else {
                    this.form.find('.alert-message').addClass('error').show().html(data.message);     
                }
            }
            this.unlock();
        }
    });
})(jQuery);