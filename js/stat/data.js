Data = {
    init: function(data, meta) {
        this.values = data;
        this.meta = meta;
        this.card = [];
        
        this.computeP();
        this.computeIds();
        this.computeCard();
        this.samples = [];
    },

    computeP: function() {
        this.p = [];
        var len_j = data.length;
        var len_i = data[0].length;
        for (var i = 0; i < len_i; i++) {
            this.p[i] = [];            
            for (var j = 0; j < len_j; j++) {
                this.p[i][j] = (this.meta[i].scale == 'Ratio')? data[j][i] * 1 : data[j][i];
            }
        }
    },

    computeIds: function() {
        var num = 0;
        for (var i=0, len = meta.length; i < len; i++) {
            if (meta[i]['scale'] == 'ID') num = i;
        }
        this.ids = this.p[num];
    },
    
    computeCard: function() {
       for (var i=0, len = meta.length, j, key; i < len; i++) {
           if (typeof(meta[i]['unit']) == 'string') {
               this.card[i] = 0;
           }
           else {
               j = 0;
               for (key in meta[i]['unit']) j++;
               this.card[i] = j;
           }
        }
    },
    
    sample: function(num) {
       if (!this.samples[num]) {
           var values = this.p[num];
           var sorted = values.slice();
           sorted.sort(function(a,b){return a-b});
           var sample = {
               values: values,
               units: this.meta[num].unit, 
               card: this.card[num],
               len: values.length, 
               min: d3.min(values),
               max: d3.max(values),
               num: num,
               sorted: sorted,
               name: this.meta[num].name
           }
           this.samples[num] = sample;
       }
       return this.samples[num];
    }
}