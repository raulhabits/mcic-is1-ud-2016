$(document).ready(function () {
	$('.login-btn').click(function () {
		$.post('login', {email: $('#email').val(), password: $('#password').val()}, function (data, status) {
			if(data.result == 'SUCCESS'){
				window.location.replace("/profile");
			}
		});
	});

	if ($('#tabs').length) {
		$( "#tabs" ).tabs();
	}
});
