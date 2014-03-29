$(document).ready(function() {
	var toggle = 0;
	var player = 0;
	$(".flat-grid-cell").click(function(e){
		if (toggle) {
			if (player == 0) {
				$(this).css("background", "red");
				player = 1 - player;
			} else{
				$(this).css("background", "black");
				player = 1 - player;
			};
			setTimeout(function() {

				$(".flat-inner-grid-cell").fadeIn(500);
			}, 1000);
			toggle = 1 - toggle;
		} else{
			$(this).css("position", "absolute").animate({
				height: 500,
				width: 500
			}, 500);
			//$(".flat-inner-grid-cell").fadeOut(500);
			toggle = 1 - toggle;
		};

		

	});
});