$(function() {
    $('.sender').click(function(){
        var data = [], data_c = 0, checked_c = 0;
        $('#survey_form input[type="radio"]').each(function(i, el){
            if (!data[$(el).attr('name')]) {
                data[$(el).attr('name')] = 1;
                data_c++;
            }
            if ($(el).attr('checked')) {
                checked_c++;
                
            }            
        });
        var corr = true;
        $('#survey_form input[type="text"]').each(function(i, el){
            el = $(el);
            var value = $(el).val() * 1;
            var flag = true;
            if (isNaN(value)) {
                flag = false;
            }
            else {
                flag = !(el.data('min') * 1 > value || el.data('max') * 1 < value || (value * Math.pow(10, el.data('dec') * 1) != Math.floor(value * Math.pow(10, el.data('dec') * 1))));
            }
            if (flag) {
                el.next('span.err').html('');
                el.removeClass('validation-wrong');
            }
            else {
                el.next('span.err').html('Should be from ' + el.data('min') + ' to ' + el.data('max'));
                el.addClass('validation-wrong');
                corr = false;
                
            }         
        });
        
        if (data_c != checked_c) {
            $('.send_error').show();
        }
        else {
            if (corr) {    
                $.request('surveys/answer', $('#survey_form').serialize(), function(){window.location.href = '/surveys/'+$('#survey_id').val()+'/analysis'});
            }
        }   
    });
});