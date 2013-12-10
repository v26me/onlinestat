var state = {
    var1: 0,
    var2: -1,
    method: 'description',
    s: function() {
        var s1 = (Data.meta[this.var1].scale == 'Nominal')? 'n' : 'r';
        var s2 = ' ';
        if (this.var2 != -1) {
            s2 = (Data.meta[this.var2].scale == 'Nominal')? 'n' : 'r';         
        }
        return s1+s2+this.method.substr(0, 1);
    },
    ss: function() {
        return this.s().substr(0, 2);
    } 
}

var Menu = {
    init: function() {
        O.listen('change_var1', Menu.on_change_var1);
        O.listen('change_var2', Menu.on_change_var2);
        O.listen('change_method', Menu.on_change_method);
        $('.vars a').click(function() {O.notify('change_var1', $(this).data('num'));});
        $('.add-vars ul a').click(function() {O.notify('change_var2', $(this).data('num'));});
        $('.method a').click(function() {O.notify('change_method', $(this).data('name'));});
        this.ind = $('.method a[data-name=independence]');
        this.fit = $('.method a[data-name=fiting]');
        this.descr = $('.method a[data-name=description]');
        this.loc = $('.method a[data-name=location]');
    },
    
    start: function() {
        $('.method a[data-name=description]').addClass('active');
        $('.vars a').first().click();
        //$('.vars a[data-num=2]').click();
        //$('.add-vars a[data-num=1]').click();
    },

    update: function() {
        if (state.var1 == state.var2) {
            state.var2 = -1;
        }

        // Update dropdown menu for the second var
        $('.add-vars a').show();
        $('#add-var-name').html($('.add-vars a[data-num=' + state.var2 + ']').html());

        $('.add-vars a[data-num=' + state.var1 + ']').hide();
        $('.add-vars a[data-num=' + state.var2 + ']').hide();
        
        //If current method is not appropriate for current variable combination
        //Change it to description
        //console.log(state.ss())
        var switched_off = [];
        if (state.ss() == 'n ' || state.ss() == 'rr' || state.ss() == 'nn') {
            this.loc.hide();
            switched_off['location'] = 1;            
        }
        else {
            this.loc.show();
        }
        
        if (state.ss() == 'nr' || state.ss() == 'rn' || state.ss() == 'rr' || state.ss() == 'nn') {
            this.fit.hide();
            switched_off['fiting'] = 1;
        }
        else {
            this.fit.show();
        }
        
        if (state.ss() == 'nn' || state.ss() == 'rr') {
            this.ind.show();
        }
        else {
            this.ind.hide();
            switched_off['independence'] = 1;
        }
        
        if (switched_off[state.method]) {
            this.descr.trigger('click');
            return;
        }
        
        //Okay, now we changed state and can tell the world about it
        O.notify('change_state', state);
    },
    
    on_change_var1: function(num) {
        state.var1 = num;
        Menu.update();
    },
    
    on_change_var2: function(num) {
        state.var2 = num;
        Menu.update();
    },
    
    on_change_method: function(name) {
        state.method = name;
        O.notify('change_state', state);
    }
}

var MethodMaper = {
    on_change_state: function(state) {
        if (this.current) {
            this.current.clear();
        }
        
        var sample = Data.sample(state.var1);
        var sample2 = (state.var2 != -1)? Data.sample(state.var2) : false;
        if (state.s()[2] == 's') {
            alert('I\'m a secret button. Please, don\'t touch me again');
        }
        switch (state.s()) {
            case 'n d':
                Bar.draw(sample);
                Bar.control();
                this.current = Bar;
                break;
            case 'n f':
                Bar.draw(sample);
                Bar.control();
                this.current = Bar;
                Bar.drawDistribution();
                break;
            case 'r d':
                Hist.draw(sample);
                Hist.showInfo();
                Hist.control();
                this.current = Hist;
                break;
            case 'r f':
                QQ.draw(sample);
                this.current = QQ;
                break;
            case 'r l':
                Hist.draw(sample);
                Hist.control();
                Hist.tTest();
                this.current = Hist;
                break;
            case 'rnd':
                Box.draw(sample, sample2);
                this.current = Box;
                break;
            case 'nrd':
                Box.draw(sample2, sample);
                this.current = Box;
                break;
            case 'rnl':
                Box.draw(sample, sample2);
                Box.tTest();
                this.current = Box;
                break;
            case 'nrl':
                Box.draw(sample2, sample);
                Box.tTest();
                this.current = Box;
                break;
            case 'rrd':
                Scatter.draw(sample, sample2);
                this.current = Scatter;
                break;
            case 'nnd':
                if (sample2.card < sample.card) {
                    Chord.draw(sample2, sample);
                }            
                else {
                    Chord.draw(sample, sample2);
                }
                Chord.showInfo();
                this.current = Chord;
                break;
            case 'nni':
                if (sample2.card < sample.card) {
                    Chord.draw(sample2, sample);
                }            
                else {
                    Chord.draw(sample, sample2);
                }
                Chord.cross();
                this.current = Chord;
                break;
            case 'rri':
                Scatter.draw(sample, sample2);
                Scatter.corr();
                this.current = Scatter;
                break;
        }
    }
}

$(function() {
    Data.init(data, meta);
    O.listen('change_state', $.proxy(MethodMaper.on_change_state, MethodMaper));
    Menu.init();
    Menu.start();
});

    /*function normalize(x) {
        var sum = 0;
        for (var i = 0; i < x.length; i++) {
            sum += x[i];
        }
        for (var i = 0; i < x.length; i++) {
            x[i] = x[i] / sum;
        }
        return x;
    }
    
    function uni(x) {
        var r = Math.random();
        var cur = 0;
        for (var i = 0; i < x.length; i++) {
            cur += x[i];
            if (r < x[i]) return i;
        }
        return x.length - 1;
    }

    function norm(m, s) {
        return d3.random.normal(m, s)();
    }
    
    var N = 30;
    var result = "";
    var sex, character, movie, height, weight, bmi;
    for (var i=0; i < N; i++) {
        sex = uni([0.52, 0.48]);
        character = (sex == 0)? uni(normalize([7, 2, 13, 5, 7])) : uni(normalize([12, 2, 13, 7, 3]));
        movie = (sex == 0)? uni([0.4, 0.6]) : uni([0.6, 0.4]);
        height = (sex == 0)? norm(177, 7) : norm(164, 5);
        bmi = (sex == 0)? norm(23.3, 0.5) : norm(23.7, 0.5);
        weight = (height / 100) * bmi * (height / 100);
        height = Math.round(height);
        weight = Math.round(weight);
        result += '- data: {"sex":"'+sex+'", "character":"'+character+'", "movie":"'+movie+'", "height":"'+height+'", "weight":"'+weight+'"}' + "\n" +
                  '  survey_id: 4'+ "\n\n";
        
    }
    console.log(result);
    return;
    */