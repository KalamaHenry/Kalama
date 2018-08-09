//导航栏下拉列表
$('.myNav .slideDown').hover(function() {
	if($(window).width()>960)
		$(this).children('ul').stop().show(600)
}, function() {
	$(this).children('ul').stop().hide()
});	
//小屏幕：按钮下拉列表
$('.myNav .nav-wrap .navbar-toggle').click(function(event) {
	$(this).toggleClass('navar-click');
	$('.myNav .navbar-collapse').slideToggle()
});
//设置html的font-size
function setFontSize(){
	var deviceWidth=document.documentElement.clientWidth;
	//当deviceWidth大于设计稿的横向分辨率时，html的font-size始终等于横向分辨率/body元素宽
	if(deviceWidth>1423)
		deviceWidth=1423;
	document.documentElement.style.fontSize=deviceWidth/3+'px';
}
setFontSize();
//大屏幕
$(window).resize(function(event) {
	setFontSize();
	if($(window).width()>960){
		$('.myNav .navbar-collapse').show();
		$('.myNav .nav-wrap .navbar-toggle').removeClass('navar-click');
	}
	else{
		$('.myNav .nav-wrap .navbar-toggle').removeClass('navar-click');
		$('.myNav .navbar-collapse').hide()
	}
});
//轮播图
//自动播放
var num=0;
var timer;
function gogo(){
	timer=setInterval(function(){
		carouselChange(num);
		num++;
		if(num>2)
			num=0;
	},2000)
}
gogo();
//停留在上方
$('.con-left .carousel').hover(function() {
	clearInterval(timer);
}, function() {
	gogo()
});
//点击左箭头
$('.con-left .carousel-turn .left').click(function(event) {
	clearInterval(timer)
	num--;
	if(num<0)
		num=2;
	carouselChange(num);
});
//点击右箭头
$('.con-left .carousel-turn .right').click(function(event) {
	clearInterval(timer)
	num++;
	if(num>2)
		num=0;
	carouselChange(num);
});
//点击小圆圈
$('.con-left .carousel-circle li').click(function(event) {
	num=$(this).index();
	carouselChange(num);
});
//圆圈和li变化
function carouselChange(n){
	$('.con-left .carousel-inner>li').eq(n).fadeIn(400).siblings('li').fadeOut()
	$('.con-left .carousel-circle li').eq(n).addClass('active').siblings('li').removeClass('active')
}
//右边鼠标移动，阴影变化
$('.c-r-items .item-top>li').hover(function(){
	$(this).children('a').fadeToggle(600)
})

/*
 *	内容主题
 */
//item中的图片放大，缩小
$('.con-left .article .item .left,.con-right .c-r-items .item .intro').hover(function() {
	$(this).animate({'background-size':'112%'}, 400)
},function(){
	$(this).animate({'background-size':'100%'}, 400)
});
$('.con-right .item .lists>li').hover(function() {
	$(this).children('.pic').animate({'background-size':'132%'}, 400)
}, function() {
	$(this).children('.pic').animate({'background-size':'122%'}, 400)
});
//滚动鼠标，文章列表上移
//页面一进来就remove
$('.con-left .article .item').each(function() {
	if($(this).offset().top>=$(window).scrollTop()){
		$(this).removeClass('item-float')
	}
});
$(window).scroll(function() {
	$('.con-left .article .item').each(function(e) {
		var x=$(window).scrollTop()-$(this).offset().top;
		var y=$(this).offset().top-$(window).height();//标签距离窗口底部的距离
		if((y<$(window).scrollTop())&&(x<=0)){
			$(this).removeClass('item-float')
		}else{
			$(this).addClass('item-float')
		}

	});
});
//加载更多
var more=1;
$('.more-btn').click(function(event) {
	$.ajax({
		url:'/index',
		method:'get',
		// data:{moreData:more,len:$('.article .item').length},
		data:{len:$('.article .item').length},
		dataType:'json',
		success:function(res){
			if(res=='end'){
				$('.article .more').hide()
			}else{
				var con=''
				for(var i=0;i<res.length;i++){
					con=`<div class="item item-float">
								<a href="#" class="toDetail" onclick='toDetail(this)'>
									<span class="_id">${res[i]._id}</span>
									<h1 class="title">${res[i].title}</h1>
									<span class="left"></span>
									<div class="points">
										<p>${res[i].con[0].conTit+res[i].con[0].conMain}</p>
										<ul>
											<li><span class="class-icon"></span>${res[i].category}</li>
											<li><span class="time-icon"></span>${res[i].time}</li>
											<li><span class="author-icon"></span>${res[i].author}</li>
										</ul>
									</div>
								</a>
							</div>`+con;
				}
				$('.article .more').before(con)				
			}
		},
		error:function(){
		}
	})
});

function toDetail(a){
	var temp=$(a).parents('.article').find('._id').html();
	console.log(temp)
	location.href=`http://127.0.0.1:8989/detail?id=${temp}`
}