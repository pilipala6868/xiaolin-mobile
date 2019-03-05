
//左侧导航选中
var navigChosen = 'login';
//顶部模块名
var pageName = '登录';

$(document).ready(function() {

	rightBind();  //same.js中的绑定事件

	//一开始聚焦在用户名输入框
	$(".loginInput:eq(0)").focus();

	//输入框组左侧图标高度对齐
	$('.inputRow div').css('height', $('.inputRow input').innerHeight());

});

//点击登录
function loginClick()
{
	//去除提醒文字
	$('.remindWord').remove();

	//获取、检查输入
	var username = $.trim($(".loginInput:eq(0)").val());
	var password = $.trim($(".loginInput:eq(1)").val());

	//账号检测
	if (username == "")
	{
		$(".loginInput:eq(0)").val('').attr('placeholder', '请输入账号').focus();
		return false;
	}
	else if (username.length < 6 || username.length > 16)
	{
		$(".loginInput:eq(0)").val('').attr('placeholder', '账号长度必须为6-16位').focus();
		return false;
	}
	else if (username.search(/[^A-z0-9@.]+/) != -1)
	{
		$(".loginInput:eq(0)").val('').attr('placeholder', '账号含有非法字符，请重新输入').focus();
		return false;
	}
	//密码检测
	if (password == "")
	{
		$(".loginInput:eq(1)").val('').attr('placeholder', '请输入密码').focus();
		return false;
	}
	else if (password.length < 6 || password.length > 16)
	{
		$(".loginInput:eq(1)").val('').attr('placeholder', '密码长度必须为6-16位').focus();
		return false;
	}
	else if (password.search(/[^A-z0-9@.]+/) != -1)
	{
		$(".loginInput:eq(1)").val('').attr('placeholder', '密码含有非法字符，请重新输入').focus();
		return false;
	}

	//密码校验
	$.ajax({
		type: 'POST',
		url: 'php/login.php',
		data: {
			'type': 'login',
			'username': username,
			'password': password
		},
		success: function(data) {
			var returnData = jQuery.parseJSON(data);
			//账号不存在
			if (returnData == 'undefinded')
			{
				$("#login_table .inputRow").eq(0).before("<div class='remindWord'>该账号不存在</div>");
				$(".loginInput:eq(0)").focus();
			}
			//密码错误
			else if (returnData == 'wrongPassword')
			{
				$("#login_table .inputRow").eq(1).before("<div class='remindWord'>密码错误，请重新输入</div>");
				$(".loginInput:eq(1)").val('').focus();
			}
			//登录成功
			else
				loginSuccess('loginBox', returnData);
		}
	});
}

//点击注册
function registerClick()
{
	//去除提醒文字
	$('.remindWord').remove();
	
	//获取、检查输入
	var name = $.trim($(".registerInput:eq(0)").val());
	var username = $.trim($(".registerInput:eq(1)").val());
	var password = $.trim($(".registerInput:eq(2)").val());
	var passwordConfirm = $.trim($(".registerInput:eq(3)").val());
	var email = $.trim($(".registerInput:eq(4)").val());

	//昵称检测
	if (name == "")
	{
		$(".registerInput:eq(0)").val('').attr('placeholder', '请输入淘宝ID / QQ昵称').focus();
		return false;
	}
	else if (name.search(/[*%#&|]+/) != -1)
	{
		$(".registerInput:eq(0)").val('').attr('placeholder', '含有非法字符，请重新输入').focus();
		return false;
	}
	//账号检测
	if (username == "")
	{
		$(".registerInput:eq(1)").val('').attr('placeholder', '请输入账号').focus();
		return false;
	}
	else if (username.length < 6 || username.length > 16)
	{
		$(".registerInput:eq(1)").val('').attr('placeholder', '账号长度必须为6-16位').focus();
		return false;
	}
	else if (username.search(/[^A-z0-9@.]+/) != -1)
	{
		$(".registerInput:eq(1)").val('').attr('placeholder', '账号含有非法字符，请重新输入').focus();
		return false;
	}
	//密码检测
	if (password == "")
	{
		$(".registerInput:eq(2)").val('').attr('placeholder', '请输入密码').focus();
		return false;
	}
	else if (password.length < 6 || password.length > 16)
	{
		$(".registerInput:eq(2)").val('').attr('placeholder', '密码长度必须为6-16位').focus();
		return false;
	}
	else if (password.search(/[^A-z0-9@.]+/) != -1)
	{
		$(".registerInput:eq(2)").val('').attr('placeholder', '密码含有非法字符，请重新输入').focus();
		return false;
	}
	//密码检测
	if (passwordConfirm == "")
	{
		$(".registerInput:eq(3)").val('').attr('placeholder', '请再次输入密码').focus();
		return false;
	}
	else if (passwordConfirm != password)
	{
		$(".registerInput:eq(3)").val('').attr('placeholder', '与密码不同，请重新确认输入').focus();
		return false;
	}
	//邮箱检测
	if (email == "")
	{
		$(".registerInput:eq(4)").val('').attr('placeholder', '请输入邮箱（以购买后发送曲谱、伴奏文件）').focus();
		return false;
	}
	else if (email.search(/[A-z0-9_]+@[A-z0-9]+\.[A-z0-9]+/))
	{
		$(".registerInput:eq(4)").val('').attr('placeholder', '邮箱格式错误，请重新输入').focus();
		return false;
	}

	//注册
	$.ajax({
		type: 'POST',
		url: 'php/login.php',
		data: {
			'type': 'register',
			'name': name,
			'username': username,
			'password': password,
			'email': email
		},
		success: function(data) {
			var returnData = jQuery.parseJSON(data);

			//账号重复
			if (returnData == 'usernameExist')
			{
				$("#register_table .inputRow").eq(1).before("<div class='remindWord'>该账号已存在，请重新输入</div>");
				$(".registerInput:eq(1)").focus();
			}
			//注册失败
			else if (!returnData)
			{
				$("#register_table .inputRow").eq(0).before("<div class='remindWord'>注册失败，请检查输入</div>");
				$(".registerInput:eq(0)").focus();
			}
			//注册成功
			else
			{
				$('#loginSuccess div').eq(0).text('注册成功！');
				loginSuccess('registerBox', returnData);
			}
		}
	});
}

//登录成功
function loginSuccess(boxType, returnData)
{
	//创建cookie
	$.cookie('user_id', returnData['user_id'], { expires: 3, path: '/'});
	$.cookie('user_name', returnData['name'], { expires: 3, path: '/'});

	//显示登录成功
	$('#'+boxType).fadeOut('100', function() {
		$('#loginSuccess').fadeIn('100');
	});

	//5s倒计时
	var countDownNum = 5;
	var countDown = setInterval(function(){ 
		countDownNum--;
		if (countDownNum <= 0)
			window.location.href = 'personal.html';
		$('#loginSuccess span').text(countDownNum);	
	}, 1000);
}

//切换登录/注册表单按钮
function switchClick()
{
	//表单切换
	$('#loginBox').fadeOut('100', function() {
		$('#registerBox').fadeIn('100');
		//聚焦在第一个输入框
		$(".registerInput:eq(0)").focus();
	});
	//顶部模块名切换
	$('#pageName h2').text('注册');
}