$(function() {
    $('.publish_btn').click(function(){
        if (data.length < 1) {
            $('#cannotPublish').modal();
        }
        else {
            $('#beforePublish').modal();
        }
    });    
    
    $('.real-publish').click(function() {
        $('#beforePublish').modal('hide');
        var btn = $('.publish_btn');
        btn.button('loading');
        $.request('surveys/publish', {id: btn.data('id')}, function() {
            btn.unbind('click');
            btn.addClass('disabled').html('Published');
        });
    })

    $('body').on('click', '.random', function() {
        if ($(this).hasClass('icon-random')) {
            $(this).removeClass('icon-random').addClass('icon-arrow-right').next('input').val(0);              
        }
        else {
            $(this).removeClass('icon-arrow-right').addClass('icon-random').next('input').val(1);
        }
    });    

    $('#add_form .q-cancel').click(clear);
    $('#add_num_form .q-cancel').click(num_clear);
    
    $('#add_form .q-more').click(function(){
        var len = $('.add_q_form li.hide').length;
        if (len > 0) {
            $('.add_q_form li').eq(5 - len).removeClass('hide');
        }
        if (len == 1) {
            $('#add_form .q-more').hide();
        }
    });
    
    var sender = $('#add_form').sender({url:'surveys/add_question'});
    var num_sender = $('#add_num_form').sender({url:'surveys/add_question'});
    
    $('.add_q_btn a.simple').click(function(){
        $('.add_q_btn').hide();
        $('.add_q_form').show();
        $('.add_q_form input[type="file"]').hide();
        sender.options.pre_validate = false;
    });
    
    $('.add_q_btn a.image').click(function(){
        $('.add_q_btn').hide();
        $('.add_q_form').show();
        $('.add_q_form input[type="file"]').show();
        sender.options.pre_validate = pre_validate;
        sender.options.file_submit = true;
    });

    $('.add_q_btn a.num').click(function(){
        $('.add_q_btn').hide();
        $('.add_num_q_form').show();        
    });

    $('body').on('click', '.del', del);
    $('body').on('click', '.edit', edit);
    $('body').on('click', '.edit_form .q-cancel', edit_clear);
    $('body').on('click', '.edit_form .q-more', function(){
        var len = $('.edit_form li.hide').length;
        if (len > 0) {
            $('.edit_form li').eq(5 - len).removeClass('hide');
        }
        if (len == 1) {
            $('.edit_form .q-more').hide();
        }
    });
});

function pre_validate() {
    var flag = true;
    $('.add_q_form .validation-message').remove();
    $('.add_q_form input[name="options[]"]').each(function(i, el) {        
        if ($(el).val() && !$(el).next('input').val()) {
            $(el).next('input').after('<span class="validation-message help-inline"> field must be filled in</span>')  
            flag = false;
        }
    });
    return flag;
}

function pre_validate_edit() {
    var flag = true;
    $('.edit_form .validation-message').remove();
    $('.edit_form input[name="options[]"]').each(function(i, el) {     
        if ($(el).val() && !$(el).next('input').val() && !$(el).closest('li').children('img').length) {
            $(el).next('input').after('<span class="validation-message help-inline"> field must be filled in</span>')  
            flag = false;
        }
    });
    return flag;
}
/*
function on_add(data2) {
    clear();
    var html = '<div class="question"><hr /><div class="view_place"><h3>'+ data2['question'] + '</h3>' +
               '<div class="actions"><a data-id="'+ data2['id'] + '" class="edit" href="#">Edit</a> ' +
               '<a class="del" data-id="'+ data2['id'] + '" href="#">Delete</a>' +
               '</div></div><div class="edit_place"></div></div>';
    $('.questions').append(html);
    data[data2['id']] = data2;               
}

function on_num_add(data2) {
    num_clear();
    var html = '<div class="question"><hr /><div class="view_place"><h3>'+ data2['question'] + '</h3>' +
               '<div class="actions"><a data-id="'+ data2['id'] + '" class="edit" href="#">Edit</a> ' +
               '<a class="del" data-id="'+ data2['id'] + '" href="#">Delete</a>' +
               '</div></div><div class="edit_place"></div></div>';
    $('.questions').append(html);
    data[data2['id']] = data2;               
}*/

function clear() {
    $('.add_q_form input[type="file"]').hide();
    $('.add_q_form').hide();
    $('.add_q_btn').show();
    var id_inp = $('.add_q_form input[name="id"]');
    var id = id_inp.attr('value');
    $('.add_q_form input').attr('value', '');
    id_inp.attr('value', id);
    $('.add_q_form li').slice(2).addClass('hide');
    $('#add_form .q-more').show();
}

function num_clear() {
    $('.add_num_q_form').hide();
    $('.add_q_btn').show();
    var id_inp = $('.add_num_q_form input[name="id"]');
    var id = id_inp.attr('value');
    $('.add_num_q_form input').attr('value', '');
    $('.add_num_q_form input[name="min"]').attr('value', '0');
    $('.add_num_q_form input[name="max"]').attr('value', '100');
    $('.add_num_q_form input[name="dec"]').attr('value', '0');
    $('.add_num_q_form input[name="type"]').attr('value', 'num');
    id_inp.attr('value', id);
}

function edit_clear() {
    $(this).closest('.question').children('.view_place').show();
    $(this).closest('.question').children('.edit_place').html('');
    $('.actions').show();
}

function del() {
    $.request('surveys/del_question', {id: $(this).data('id')});
    $(this).closest('.question').remove();
}

function edit() {
    if ($(this).hasClass('num')) {
        edit_num($(this));
        return;
    }

    var id = $(this).data('id');
    var q = $(this).closest('.question'); 
    var type = $(this).hasClass('simple')? 'simple' : 'image';
    
    q.children('.view_place').hide();
    $('.actions').hide();
    q.children('.edit_place').html($('#edit_tmpl').html());
    q.find('form').addClass('edit_form');
    
    if (type == 'image') {
        $('.edit_form input[type="file"]').show();
    }
    else {
        $('.edit_form input[type="file"]').hide();
    }
    
    var sender = $('.edit_form').sender({url:'surveys/edit_question', callback: function(data2) {
        data[data2['id']] = data2
        q.find('h3').html(data2.question)
        q.children('.view_place').show();
        $('.actions').show();
        q.children('.edit_place').html('');
    }});
    
    if (type == 'image') {
        sender.options.file_submit = true;
        sender.options.pre_validate = pre_validate_edit;
    }
    
    $('.edit_form input[name="name"]').attr('value', data[id].name);
    $('.edit_form input[name="id"]').attr('value', id);
    $('.edit_form input[name="question"]').attr('value', data[id].question);
    if (data[id].options.random) {
        $('.edit_form .random').removeClass('icon-arrow-right').addClass('icon-random').next('input').val(1);
    }
    else {
        $('.edit_form .random').removeClass('icon-random').addClass('icon-arrow-right').next('input').val(0);
    }
    var opts = $('.edit_form input[name="options[]"]');
    if (type == 'simple') {
        for (var i = 0; i < data[id].options.options.length; i++) {
            if (data[id].options.options[i]) {
                opts.eq(i).attr('value', data[id].options.options[i]).closest('li').removeClass('hide');
            }
            else {
                break;
            }
        }
    }
    else {
        for (var i = 0; i < data[id].options.options.length; i++) {
            if (data[id].options.options[i]) {
                opts.eq(i).attr('value', data[id].options.options[i]).closest('li').removeClass('hide');
                opts.eq(i).next('input').after('<img src="/uploads/img/'+data[id].options.images[i]+'" style="height: 40px; margin: 2px 0 2px 10px;"/>')
            }
            else {
                break;
            }
        }
    }
}

function edit_num(el) {
    var id = el.data('id');console.log(123);
    var q = el.closest('.question'); 
    
    q.children('.view_place').hide();
    $('.actions').hide();
    q.children('.edit_place').html($('#edit_num_tmpl').html());
    q.find('form').addClass('edit_form');
    
    var sender = $('.edit_form').sender({url:'surveys/edit_question', callback: function(data2) {
        data[data2['id']] = data2
        q.find('h3').html(data2.question)
        q.children('.view_place').show();
        $('.actions').show();
        q.children('.edit_place').html('');
    }});
    
    $('.edit_form input[name="name"]').attr('value', data[id].name);
    $('.edit_form input[name="id"]').attr('value', id);
    $('.edit_form input[name="question"]').attr('value', data[id].question);
    $('.edit_form input[name="min"]').attr('value', data[id].options.min);
    $('.edit_form input[name="max"]').attr('value', data[id].options.max);
    $('.edit_form input[name="dec"]').attr('value', data[id].options.dec);

}