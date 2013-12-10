O = {
    listiners: [],
    
    notify: function(message, obj) {
        var methods = this.listiners[message];
        if (!methods) return;
    
        for (var i = 0; i < methods.length; i++) {
            methods[i](obj);
        }
    },
    
    listen: function(message, method) {
        if (!this.listiners[message]) {
            this.listiners[message] = [];            
        }
        this.listiners[message].push(method);
    }        
}