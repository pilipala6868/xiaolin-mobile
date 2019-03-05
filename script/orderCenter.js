
//左侧导航选中
var navigChosen = 'login';
//顶部模块名
var pageName = '订单中心';

//声明全局的vue变量
var mainVue;

$(document).ready(function() {
	//是否付款新窗口
	var urlPart = getUrlPart(window.location.href);
	//从购物车来的付款窗口
	if (urlPart['WIDout_trade_no'] != undefined)
	{
		$('body').text('');
        form = $("<form></form>");
        form.attr('action', 'php/alipay/wappay/pay.php');
        form.attr('method', 'post');
		for (var uPart in urlPart)
		{
	        input = $("<input type='hidden' name='" + uPart + "' />")
	        input.attr('value', urlPart[uPart]);
	        form.append(input);
		}
        form.appendTo("body");
        form.submit();
	}
	//微信中需要用外部浏览器打开
	else if (urlPart['weixinpay'] == 1)
	{
		//在微信中
		if (navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1)
		{
			$('#orderList').css({
				'font-size': '0.8em',
				'margin': '1.6em'
			}).text('请点击右上角在菜单中选择在浏览器中打开，以完成支付');
			return false;
		}
		else
		{
			//创建cookie
			$.cookie('user_id', urlPart['user_id'], { expires: 3, path: '/'});
			$.cookie('user_name', urlPart['name'], { expires: 3, path: '/'});
		}
	}

	//检测有无cookie
	if ($.cookie('user_id') == undefined)
		window.location.href = "login.html";

	//获取订单信息
	$.ajax({
		type: 'GET',
		url: 'php/orderCenter.php?type=allOrder&user_id='+$.cookie('user_id'),
		success: function(data) {
			var arrayData = jQuery.parseJSON(data);
			if (arrayData != null)
			{
				//修改订单状态
				for (var i=0; i<arrayData.length; i++)
				{
					if (arrayData[i].state == 'TRADE_FINISHED' || arrayData[i].state == 'TRADE_SUCCESS')
						arrayData[i].state = '等待发货';
					else if (arrayData[i].state == 'OK')
						arrayData[i].state = '已完成';
					else if (arrayData[i].state == 'WAIT_BUYER_PAY')
						arrayData[i].state = '等待付款';
					else if (arrayData[i].state == 'TRADE_CLOSED')
						arrayData[i].state = '已关闭';
				}
				//数据更新
				mainVue = new Vue({
					el: '#orderList',
					data: {
						orderLists: arrayData
					},
					mounted() {
						rightBind();  //same.js中的绑定事件
						optionBind();  //订单按钮选项绑定
						//图片高度调整
						$('.orderListImg').css('max-height', window.innerWidth/8 + 'px');
					}
				});
			}
			else  //订单为空
			{
				rightBind();  //same.js中的绑定事件

				//内容显示
				$('#orderList').css({
					'font-size': '0.8em',
					'margin': '1.6em'
				}).text('您的订单为空');
			}
		}
	});

});

//订单按钮选项绑定
function optionBind()
{
	//订单取消
	$('.orderListCancel').click(function() {
		if (confirm('确定取消该订单吗？'))
		{
			//数据库信息更改
			$.ajax({
				type: 'GET',
				url: 'php/orderCenter.php?type=orderCancel&order_id='+$(this).attr('order_id'),
				success: function(data) {
					var returnData = jQuery.parseJSON(data);
					if (returnData)
						window.location.reload();
				}
			});
		}
	});

	//订单付款
	$('.orderListPay').click(function() {
		//识别是否在微信中
		if (navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1)
		{
			window.location.href = "orderCenter.html?weixinpay=1&user_id={0}&user_name={1}".format($.cookie('user_id'), $.cookie('user_name'));
			return false;
		}
		//表单提交
		$(this).parents('li').prev('form').submit();
		//显示订单已提交
		$('#orderList').css({
			'font-size': '0.8em',
			'margin': '1.6em'
		}).html("请付款后<a href='orderCenter.html'>刷新</a>查看付款进度");
	});
}
