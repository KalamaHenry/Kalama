$('.login').click(function(){
	if($('input[type=text]').val()==''){
		$('input[type=text]').siblings('.input-check').show()
	}else if($('.pass-wrap input').val()==''){
		$('.pass-wrap input').siblings('.input-check').show()
	}else if($('.confirm-pass input').val()==''){
		$('.confirm-pass input').siblings('.input-check').show()
	}else if($('.pass-wrap input').val()!=$('.confirm-pass input').val()){
		$('.pass-check').show();
	}else{
		$('.pass-check').hide();
		//查找数据库，查询是否存在相同的用户名
		$.ajax({
			url:'http://127.0.0.1:8989/doRegis',
			method:'post',
			data:$('.myForm').serialize(),
			dataType:'json',
			success:function(res){
				if(typeof(res)!='string'){
					$('.user-wrap .warn').eq(0).show()
				}else{
					$('.success').slideDown(600)
					setTimeout(function(){
						window.location.href='http://127.0.0.1:8989/showLogin'
					},3000)
				}
			},
			error:function(res,msg){
			}

		})
	}
})

$('input[type=text],input[type=password]').focus(function(){
	$(this).siblings('.input-check').hide()
	$(this).siblings('.pass-check').hide()
	$(this).siblings('.exist').hide();
})

