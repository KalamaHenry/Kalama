/*$('.login').click(function(event) {
	console.log('开始了')
	$.ajax({
		url: '/doLogin',
		method:'post',
		dataType: 'json',
		data: $('.myForm').serialize(),
		success: function(res){
			console.log('执行了登录'+res)
			$('.myNav .user .username').show()
			// $('.myNav .user .noLogin').hide()
			$('.myNav .user .noLogin a').css({'color':'red'})
			// location.href=`/index`
		},
		error:function(res,msg){

		}

	})
});*/

//设置html的font-size
function setFontSize(){
	var deviceWidth=document.documentElement.clientWidth;
	//当deviceWidth大于设计稿的横向分辨率时，html的font-size始终等于横向分辨率/body元素宽
	if(deviceWidth>1423)
		deviceWidth=1423;
	document.documentElement.style.fontSize=deviceWidth/3+'px';
}
setFontSize();
$(window).resize(function(){
	setFontSize();
})