(function($) {
    $.request = function(url, data, callback, context, is_html) {
        $.ajax('/s/' + url, {
            dataType: (is_html)? 'html' : 'json',
            type: 'post',
            success: (context)? $.proxy(callback, context) : callback ,
            data: data
        });        
    }
})(jQuery);
log = function(x) {console.log(x)};
Number.prototype.p = function(flag) {
    if (!flag && this > Math.pow(10, 5)) return Infinity;
    if (!flag && Math.abs(this) < Math.pow(10, -5)) return this.toPrecision(2);
    if (!flag && Math.abs(this) < Math.pow(10, -4)) return this.toPrecision(3);
    return (flag)? ((flag == 2)? d3.round((this * 100), 2) + '%' : d3.round(this, 4) ) : p(this);
}
p = function(x) {
    return (x > Math.pow(10, 4))? Math.round(x) : x.toPrecision(4);
}

getC = function(p) {
    var s, c = 1/3;
    return 'style="color: rgb(' + (182 - Math.floor((182 - 70) * Math.pow(p, c))) + ', ' + (74 + Math.floor((136 - 74) * Math.pow(p, c))) + ', ' + (72) + ')"';
}