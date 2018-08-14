/*
* @Author: Administrator
* @Date:   2018-08-05 15:31:36
* @Last Modified by:   Administrator
* @Last Modified time: 2018-08-10 22:07:59
*/
$('.sub-btn').click(function(event) {
	if($('.con-tit').val()==''){
		$('.con .con-left .tips_text').show()
	}else if($('.edit').val()==''){
		$('.con .con-left .tips_bot').show()
	}else if($('option:selected').index('select option')=='0'){
		alert('请选择文章分类')
	}else{//发布文章
		$.ajax({
			url:`/publish`,
			method:'get',
			data:{
				title:$('.con .con-left .con-tit').val(),
				con:$('.con .con-left textarea').val(),
				category:$('option:selected').val()
			},
			success:function(res){
				if(res=='ok')
					location.href='/article_manage'
				else
					alert('后台出错了')
			},
			error:function(err){

			}
		})
	}
});

$('.con-tit').keyup(function(event) {
	$('.con .con-left .tips_text').hide()
});
$('.edit').keyup(function(event) {
	$('.con .con-left .tips_bot').hide()
});

//删除文章
$('.article .points .r .delete').click(function(event) {
	if(confirm('确定删除该文章？')){
		var temp=$(this).parents('.item').find('.author-id').html()
		location.href=`/deleteArt?id=${temp}`
	}else{
		console.log('取消删除')
	}
});