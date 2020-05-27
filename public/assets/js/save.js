$(document).ready(() => {
	$.getJSON('/titles', data => {
		for (let i = 0; i < data.length; i++) {
			let model = data[i];

			
		}
	});

	$('#category-search').on('submit', function () {
		event.preventDefault()

		let data = $('form').serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		console.log(data);
		$('#result-table').removeClass('hidden')
		console.log('hidden class removed');
		

		$.ajax({
			type: 'GET',
			url: '/titles',
			data: data,
			dataType: 'json',
			success: function(data){
				console.log("Request Sent: " + data);
				
			}
		}).then(function (response) {
			// console.log(response);
			for (let i = 0; i < response.length; i++){
				let model = response[i]

				$('#result-table').append(
					`
					<tr>
						<td>${i+1}</td>
						<td>${model.title}</td>
						<td>${model.edition}</td>
						<td>${model.link}</td>
					<tr>
					`
				)

			}
			
		})
		
	})

	

		


	
});
