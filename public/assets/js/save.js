$(document).ready(() => {
	$.getJSON('/articles', data => {
		for (let i = 0; i < data.length; i++) {
			let model = data[i];

			if (model.saved) {
				$('#saved-articles').prepend(
					'<div class="row article-container ">' +
						'<div class="col-3">' +
						'   <img src=" ' +
						model.img +
						' " style="width:100%">' +
						' </div>' +
						'<div class="col-8">' +
						'   <a href=" ' +
						model.link +
						' "><h3>' +
						model.title +
						'   </h3></a>' +
						'   <p> ' +
						model.summary +
						'   </p>' +
						'</div>' +
						'<div class="col-1">' +
						'   <button class="remove-article button" data-id="' +
						model._id +
						' "><i class="fa fa-trash"></i></button>' +
						'   </div>' +
						'</div>'
				);
			}
		}
	});

	$(document).on('click', '.remove-article', function() {
		$(this)
			.children('i.fa-bookmark')
			.removeClass('fa-bookmark')
			.addClass('fa-check-circle');

		const articleID = $(this).attr('data-id');
		console.log(articleID);

		$.ajax({
			method: 'POST',
			url: '/unsave/' + articleID,
			data: {
				saved: false
			}
		}).done(data => {
			console.log('data: ', data);
		});
	});
});
