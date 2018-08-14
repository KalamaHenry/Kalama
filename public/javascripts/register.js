$('.login').click(function(){
	if($('input[type=text]').val()==''){
		$('.input-check').eq(0).show()
	}else if($('.pass-wrap input').val()==''){
		$('.input-check').eq(1).show()
	}else if($('.confirm-pass input').val()==''){
		$('.input-check').eq(2).show()
	}else if($('.pass-wrap input').val()!=$('.confirm-pass input').val()){
		$('.pass-check').show();
	}else{
		$('.pass-check').hide();
		//查找数据库，查询是否存在相同的用户名
		$.ajax({
			url:'/doRegis',
			method:'post',
			data:$('.myForm').serialize(),
			dataType:'json',
			success:function(res){
				if(typeof(res)!='string'){
					$('.warn').eq(0).show()
				}else{
					$('.warn').eq(0).hide()
					$('.success').slideDown(600)
					setTimeout(function(){
						window.location.href='/showLogin'
					},3000)
				}
			},
			error:function(res,msg){
			}

		})
	}
})

$('input[type=text],input[type=password]').focus(function(){
	$('.input-check').hide()
	$('.pass-check').hide()
	$(this).siblings('.exist').hide();
})

