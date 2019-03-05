
//左侧导航选中
var navigChosen = 0;
//顶部模块名
var pageName = '个人中心';

$(document).ready(function() {
	//检测有无cookie
	if ($.cookie('user_id') == undefined)
		window.location.href = "login.html";

	//问候语
	$('#hiToUser').text('Hello, ' + $.cookie('user_name'));

	//盒子高度设定
	$(".funcBox").css('height', $('.funcBox').css('width')*0.95);

	rightBind();  //same.js中的绑定事件
});

//个人信息显示
function personalInfo()
{
	//切换至信息表单
	$('#allFuncBox').fadeOut(200, function() {
		$('#personalInfo').show(function() {
			if ($('.personalInfoInput').eq(0).val() == '')
			{
				//个人信息填充
				$.ajax({
					type: 'GET',
					url: 'php/personal.php?type=personalInfo&user_id='+$.cookie('user_id'),
					success: function(data) {
						var arrayData = jQuery.parseJSON(data);
						//数据更新
						new Vue({
							el: '#personalInfo',
							data: {
								personalInfo: arrayData
							},
							mounted() {
								//输入框组左侧图标高度对齐
								$('.inputRow div').css('height', $('.inputRow input').innerHeight());
								$('#personalInfo').fadeTo(200, 1);
							}
						});
					}
				});
			}
		});
	});
}

//个人信息修改
function personalInfoUpdate()
{
	//获取、检查输入
	var name = $.trim($(".personalInfoInput:eq(0)").val());
	var username = $.trim($(".personalInfoInput:eq(1)").val());
	var passwordOld = $.trim($(".personalInfoInput:eq(2)").val());
	var passwordNew = $.trim($(".personalInfoInput:eq(3)").val());
	var passwordNewConfirm = $.trim($(".personalInfoInput:eq(4)").val());
	var email = $.trim($(".personalInfoInput:eq(5)").val());

	//昵称检测
	if (name == "")
	{
		$(".personalInfoInput:eq(0)").val('').attr('placeholder', '请输入淘宝ID / QQ昵称').focus();
		return false;
	}
	else if (name.search(/[*%#&|]+/) != -1)
	{
		$(".personalInfoInput:eq(0)").val('').attr('placeholder', '含有非法字符，请重新输入').focus();
		return false;
	}
	//账号检测
	if (username == "")
	{
		$(".personalInfoInput:eq(1)").val('').attr('placeholder', '请输入账号').focus();
		return false;
	}
	else if (username.length < 6 || username.length > 16)
	{
		$(".personalInfoInput:eq(1)").val('').attr('placeholder', '账号长度必须为6-16位').focus();
		return false;
	}
	else if (username.search(/[^A-z0-9@.]+/) != -1)
	{
		$(".personalInfoInput:eq(1)").val('').attr('placeholder', '账号含有非法字符，请重新输入').focus();
		return false;
	}
	//邮箱检测
	if (email == "")
	{
		$(".personalInfoInput:eq(5)").val('').attr('placeholder', '请输入邮箱（以购买后发送曲谱、伴奏文件）').focus();
		return false;
	}
	else if (email.search(/[A-z0-9_]+@[A-z0-9]+\.[A-z0-9]+/))
	{
		$(".personalInfoInput:eq(5)").val('').attr('placeholder', '邮箱格式错误，请重新输入').focus();
		return false;
	}

	//需要提交的数据
	var dataUpdate = {
		'name': name,
		'username': username,
		'email': email
	};

	//更新信息
	if (passwordOld != "")  //需修改密码
	{
		//新密码检测
		if (passwordNew == "")
		{
			$(".personalInfoInput:eq(3)").val('').attr('placeholder', '请输入新密码').focus();
			return false;
		}
		else if (passwordNew.length < 6 || passwordNew.length > 16)
		{
			$(".personalInfoInput:eq(3)").val('').attr('placeholder', '新密码长度必须为6-16位').focus();
			return false;
		}
		else if (passwordNew.search(/[^A-z0-9@.]+/) != -1)
		{
			$(".personalInfoInput:eq(3)").val('').attr('placeholder', '新密码含有非法字符，请重新输入').focus();
			return false;
		}
		//重复输入密码检测
		if (passwordNewConfirm == "")
		{
			$(".personalInfoInput:eq(4)").val('').attr('placeholder', '请再次输入新密码').focus();
			return false;
		}
		else if (passwordNewConfirm != passwordNew)
		{
			$(".personalInfoInput:eq(4)").val('').attr('placeholder', '与新密码不同，请重新确认输入').focus();
			return false;
		}

		//旧密码校验
		$.ajax({
			type: 'POST',
			url: 'php/personal.php?type=passwordConfirm&user_id='+$.cookie('user_id'),
			data: {
				'password': passwordOld
			},
			success: function(data) {
				var returnData = jQuery.parseJSON(data);
				//密码错误
				if (returnData == 'wrongPassword')
				{
					$("#personalInfo_table .inputRow").eq(2).before("<div class='remindWord'>旧密码错误，请重新输入</div>");
					$(".personalInfoInput:eq(2)").val('').focus();
				}
				//密码正确，更新新密码
				else if (returnData == 'allRight')
				{
					dataUpdate['passwordNew'] = passwordNew;
					//提交修改
					$.ajax({
						type: 'POST',
						url: 'php/personal.php?type=updateInfo&user_id='+$.cookie('user_id'),
						data: dataUpdate,
						success: function(data) {
							infoUpdateSucess(data);
						}
					});
				}
			}
		});
	}
	else  //不需修改密码
	{
		//提交修改
		$.ajax({
			type: 'POST',
			url: 'php/personal.php?type=updateInfo&user_id='+$.cookie('user_id'),
			data: dataUpdate,
			success: function(data) {
				infoUpdateSucess(data);
			}
		});
	}

	//信息修改ajax提交success后
	function infoUpdateSucess(data)
	{
		var returnData = jQuery.parseJSON(data);

		//更新失败
		if (!returnData)
		{
			$("#personalInfo_table .inputRow").eq(0).before("<div class='remindWord'>更新失败，请检查输入</div>");
			$(".personalInfoInput:eq(0)").focus();
		}
		//更新成功
		else
		{
			$('#logoutSuccess div').eq(0).text('个人信息更新成功！');
			$('#logoutSuccess div a').attr('href', 'personal.html').text('个人中心');
			//显示更新成功
			$('#personalInfo').fadeOut('100', function() {
				$('#logoutSuccess').fadeIn('100');
			});

			//5s倒计时
			var countDownNum = 5;
			var countDown = setInterval(function(){ 
				countDownNum--;
				if (countDownNum <= 0)
					window.location.href = 'personal.html';
				$('#logoutSuccess span').text(countDownNum);	
			}, 1000);
		}
	}
}

//返回按钮
function returnClick()
{
	//表单切换
	$('#personalInfo').fadeOut('100', function() {
		$('#allFuncBox').fadeIn('100');
	});
}

//点击注销
function logout()
{
	//删除cookie
	$.removeCookie('user_id', {expires: 'Thu, 01 Jan 1970 00:00:00 GMT', path: '/'});
	$.removeCookie('user_name', {expires: 'Thu, 01 Jan 1970 00:00:00 GMT', path: '/'});

	//显示登录成功
	$('#allFuncBox').fadeOut('100', function() {
		$('#logoutSuccess').fadeIn('100');
	});

	//5s倒计时
	var countDownNum = 5;
	var countDown = setInterval(function(){ 
		countDownNum--;
		if (countDownNum <= 0)
			window.location.href = 'index.html';
		$('#logoutSuccess span').text(countDownNum);	
	}, 1000);
}
