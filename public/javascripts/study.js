//返回顶部
$(window).scroll(function(event) {
	if($(window).scrollTop()>800)
		$('.return-top').show()	
	else
		$('.return-top').hide()	
});
$('.return-top').click(function(event) {
	$('html,body').animate({'scrollTop':0}, 600)
});

