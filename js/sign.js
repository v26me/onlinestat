$(function() {
    var toggle = function(){$('div.signin, div.signup').toggle();}
    $('a.signup, a.signin').click(toggle);
    
    $('form.signin').sender({'url':'users/signin'});
    $('form.signup').sender({'url':'users/signup', 'check_url':'users/check_signup'});
});