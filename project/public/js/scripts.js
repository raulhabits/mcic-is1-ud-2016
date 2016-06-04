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


	$('.btn-update-profile').click(function () {
		var id = $('#_id').val();		
		var data = {email: $('#email').val(),
					phoneNumber: $('#phoneNumber').val(),
					name: $('#name').val(),
					address: $('#address').val(),
					};
		$.post('service/users/update', {filter:{_id:id}, data:data}, function (data, status) {
		});
		return false;
	});


	$('.btn-update-vehicle').click(function () {
		var id = $(this).attr("id").replace("update-", "");		
		var data = {color: $('#color-'+id).val(),
					active: $('#actived-'+id).is(':checked')?"checked":"false",
					stolen: $('#stolen-'+id).is(':checked')?"checked":"false",
					};
		$.post('service/vehicles/update', {filter:{_id:filter}, data:data}, function (data, status) {
		});
		return false;
	});

	$('.btn-sell-vehicle').click(function () {
		var id = $(this).attr("id").replace("sell-", "");
		var filter = {_id: id};		
		var data = {_id: $("#car-select-"+id).val()};
		$.post('sell-vehicle', {filter:filter, data:data}, function (data, status) {
		});
		return false;
	});


	$('.btn-search-date').click(function () {
		startDate = $("#start-date").val();
		endDate = $("#end-date").val();

		$.post('invoice', {startDate:startDate, endDate:endDate}, function (data, status){
			var html = '';
			$.each(data.content, function(){
				console.log($(this)[0]);
				
				html+='<div class="item form-login">';
				html+=' <div class="row"><label>Date:</label>'+$(this)[0].date+'</div>';                
                html+=' <div class="row"><label>Latitud:</label>'+$(this)[0].cabin.lat+'</div>';
                html+=' <div class="row"><label>Longitud:</label>'+$(this)[0].cabin.lon+'</div>';
                html+=' <div class="row"><label>Name:</label>'+$(this)[0].cabin.name+'</div>';
                html+=' <div class="row"><label>Vehicle Id:</label>'+$(this)[0].vehicle.id+'</div>';
                html+=' <div class="row"><label>Category:</label>'+$(this)[0].vehicle.category+'</div>';
                html+=' <div class="row"><label>Value:</label>'+$(this)[0].value+'</div>';
                html+='</div>';
                $("#tabs-2 .items").html(html);
			});
		});
		return false;
	});

});
