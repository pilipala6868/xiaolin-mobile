
//左侧导航选中
var navigChosen = 'login';
//顶部模块名
var pageName = '购物车';

//声明全局的vue变量
var mainVue, newOrderVue;

$(document).ready(function() {
	//检测有无cookie
	if ($.cookie('user_id') == undefined)
		window.location.href = "login.html";

	//获取购物车信息
	$.ajax({
		type: 'GET',
		url: 'php/shoppingCart.php?type=allItem&user_id='+$.cookie('user_id'),
		success: function(data) {
			var arrayData = jQuery.parseJSON(data);
			if (arrayData != null)
			{
				//是否移调转为true、false
				var arrayData = arrayData.map(function(val){
					val['changetone'] = val['changetone']==1 ? true : false;
					return val;
				});

				//数据更新
				mainVue = new Vue({
					el: '#shoppingCart',
					data: {
						items: arrayData,
						totalNum: 0,
						totalPrice: '0.00'
					},
					mounted() {
						rightBind();  //same.js中的绑定事件
						mainBoxBind();
					},
					watch: {
						totalNum: function(val) {
							//是否勾上全选
							if (val == $('.itemBox').length)
								$('#allchecked').prop('checked', true);
							else
								$('#allchecked').prop('checked', false);
							//结算是否亮起
							if (val > 0)
								$('#settlement').addClass('clickable').attr('onclick','settlementClick()');
							else
								$('#settlement').removeClass('clickable').removeAttr('onclick');;
						},
						totalPrice: function(val) {
							this.totalPrice = toDecimal2(val);
						}
					}
				});
			}
			else  //购物车为空
			{
				rightBind();  //same.js中的绑定事件

				//内容显示
				$('#shoppingCart').css({
					'font-size': '0.8em',
					'margin': '1.6em'
				}).text('您的购物车为空');
			}
		}
	});

});

function mainBoxBind()
{
	//图片高度调整
	$('.itemImg').css('max-height', window.innerWidth/8 + 'px');

	//鼠标点击选择框
	$('.checkBox input').click(function() {
		var itemIndex = $(this).parents('li').index();
		//是否全选
		if (itemIndex == $('.itemBox').length)
		{
			if ($(this).is(':checked'))  //全择
			{
				$('.itemBox').each(function(index) {
					if (!$(this).find('input').is(':checked'))
						$(this).find('input').click();
				});
			}
			else  //取消全择
			{
				$('.itemBox').each(function(index) {
					if ($(this).find('input').is(':checked'))
						$(this).find('input').click();
				});
			}
		}
		else  //不是全选，单一样式变化
		{
			var _this = $(this).parents('.itemBox');
			if ($(this).is(':checked'))  //选择
			{
				_this.addClass('itemBoxChosen');
				//总量数据变化
				mainVue.totalNum++;
				mainVue.totalPrice = parseFloat(mainVue.totalPrice) + parseFloat(mainVue.items[itemIndex]['price']);
				if (mainVue.items[itemIndex]['changetone'] == 1)
					mainVue.totalPrice += 2.5;
			}
			else  //取消选择
			{
				_this.removeClass('itemBoxChosen');
				//总量数据变化
				mainVue.totalNum--;
				mainVue.totalPrice = parseFloat(mainVue.totalPrice) - parseFloat(mainVue.items[itemIndex]['price']);
				if (mainVue.items[itemIndex]['changetone'] == 1)
					mainVue.totalPrice -= 2.5;
			}
		}
	});

	//点击移调
	$('.optionChange').click(function() {
		var _this = $(this);
		$.ajax({
			type: 'GET',
			url: 'php/shoppingCart.php?type=changeTone&shopping_id='+$(this).attr('shopping_id'),
			success: function(data) {
				var returnData = jQuery.parseJSON(data);
				if (returnData)  //数据库修改成功
				{
					mainVue.items[_this.parents('li').index()]['changetone'] = true;
					//自动勾选
					var _thisInput = _this.parents('li').find('input');
					if (_thisInput.is(':checked'))
						mainVue.totalPrice = parseFloat(mainVue.totalPrice) + 2.5;
					else
						_thisInput.click();
					//移除移调选项
					_this.remove();
				}
			}
		});
	});

	//点击删除
	$('.optionDelete').click(function() {
		//第一次点击只变红
		if (!$(this).hasClass('redDelete'))
		{
			$(this).addClass('redDelete');
			var _this = $(this);
			//3s后恢复颜色
			var cancelRedDelete = setTimeout(function() {
				_this.removeClass('redDelete');
			}, 2000);
		}
		else
		{
			clearTimeout(cancelRedDelete);
			var _this = $(this);
			$.ajax({
				type: 'GET',
				url: 'php/shoppingCart.php?type=deleteShopping&shopping_id='+$(this).attr('shopping_id'),
				success: function(data) {
					var returnData = jQuery.parseJSON(data);
					if (returnData)  //数据库修改成功
					{
						var _thisInput = _this.parents('li').find('input');
						if (_thisInput.is(':checked'))
							_thisInput.click();
						//从购物车中移除该宝贝
						_this.parents('li').remove();
						
						//是否全部删除
						if ($('.itemBox').length == 0)
						{
							//内容显示
							$('#shoppingCart').css({
								'font-size': '0.8em',
								'margin': '1.6em'
							}).text('您的购物车为空');
						}
					}
				}
			});
		}
	});

}

//结算触发
function settlementClick()
{
	//顶部修改
	$('#pageName h2').text('结算');
	//结算的宝贝过滤
	var orderLists = mainVue.items.filter(function(val, index) {
	  	return $('.itemList').eq(index).find('input').is(':checked');
	});
	//结算页面
	$('#shoppingCart').hide();
	$('#newOrder').show(500, function() {
		var orderNumber = getOrderNumber();
		newOrderVue = new Vue({
			el: '#newOrder',
			data: {
				orderNumber: orderNumber,
				orderPrice: mainVue.totalPrice,
				orderLists: orderLists
			},
			mounted: function() {
				$('#newOrder').fadeTo(200, 1);
				//图片高度调整
				$('.orderListImg').css('max-height', window.innerWidth/8 + 'px');
			}
		});
	});
}

//绑定提交订单触发
function newOrderClick()
{
	//数据库创建订单
	$.ajax({
		type: 'POST',
		url: 'php/shoppingCart.php?type=newOrder',
		data: {
			user_id: $.cookie('user_id'),
			orderNumber: newOrderVue.orderNumber,
			orderPrice: newOrderVue.orderPrice,
			orderLists: newOrderVue.orderLists
		},
		success: function(data) {
			var returnData = jQuery.parseJSON(data);
			if (returnData)  //数据库操作成功
			{
				//识别是否在微信中
				if (navigator.userAgent.toLowerCase().indexOf('micromessenger') != -1)
				{
					window.location.href = "orderCenter.html?weixinpay=1&user_id={0}&user_name={1}".format($.cookie('user_id'), $.cookie('user_name'));
					return false;
				}
				//新建窗口提交表单（防止浏览器阻止弹窗）
				var formData = $('#newOrder form').serializeArray();
				var formDataString = formData[0]['name'] + '=' + formData[0]['value'];
				for (var i=1; i<formData.length; i++)
					formDataString += '&' + formData[i]['name'] + '=' + formData[i]['value'];
				newWindow.location = 'orderCenter.html?' + formDataString;
			}
			//显示订单已提交
			$('#newOrder').css({
				'font-size': '0.8em',
				'margin': '1.6em'
			}).html("订单已提交，请付款后前往<a href='orderCenter.html'>订单中心</a>查看付款进度");
		}
	});
}

//获取订单号
function getOrderNumber() 
{
	var vNow = new Date();
	var sNow = "";
	sNow += String(vNow.getFullYear());
	sNow += String(vNow.getMonth() + 1);
	sNow += String(vNow.getDate());
	sNow += String(vNow.getHours());
	sNow += String(vNow.getMinutes());
	sNow += String(vNow.getSeconds());
	sNow += String(vNow.getMilliseconds());
	return sNow;
}
