$(document).ready(() => {
	// $.getJSON('/articles', data => {
	// 	for (let i = 0; i < data.length; i++) {
	// 		let model = data[i];

	// 		$('#scraped-articles').prepend(
	// 			'<div class="row article-container ">' +
	// 				'<div class="col-3">' +
	// 				'   <img src=" ' +
	// 				model.img +
	// 				' " style="width:100%">' +
	// 				' </div>' +
	// 				'<div class="col-8">' +
	// 				'   <a href=" ' +
	// 				model.link +
	// 				' "><h3>' +
	// 				model.title +
	// 				'   </h3></a>' +
	// 				'   <p> ' +
	// 				model.summary +
	// 				'   </p>' +
	// 				'</div>' +
	// 				'<div class="col-1">' +
	// 				'   <button class="save-article button" data-id="' +
	// 				model._id +
	// 				' "><i class="fa fa-bookmark"></i></button>' +
	// 				'   </div>' +
	// 				'</div>'
	// 		);
	// 	}
	// });

	// $.ajax('/scrape',
	// {
	// 	url: ''
	// })
	// $.getJSON('/titles', data => {
	// 	for (let i = 1; i < data.length+1; i++) {
	// 		let model = data[i];

	// 		$('#result-table').append(
	// 			`
	// 			<tr>
	// 				<td>${i}</td>
	// 				<td>${model.title}</td>
	// 				<td>${model.edition}</td>
	// 				<td>${model.link}</td>
	// 			<tr>
	// 			`
	// 		)

	// 	}
	// })

	$('#page-link').on('submit', function(){
		// event.preventDefault()
		// console.log($('input:text').val());
		// const value = $('form').serializeObject()

		let data = $('form').serializeArray().reduce(function(obj, item) {
			obj[item.name] = item.value;
			return obj;
		}, {});

		console.log(data);
		
		$.ajax({
			type: 'GET',
			url: '/scrape',
			data: data,
			dataType: 'json',
			success: function(data){
				console.log("Request Sent: " + data);
				
			}
		})
	

		
	})

	$(document).on('click', '.save-article', function() {
		$(this)
			.children('i.fa-bookmark')
			.removeClass('fa-bookmark')
			.addClass('fa-check-circle');

		const articleID = $(this).attr('data-id');
		console.log(articleID);

		$.ajax({
			method: 'POST',
			url: '/save/' + articleID,
			data: {
				saved: true
			}
		}).done(data => {
			console.log('data: ', data);
		});
	});
});
