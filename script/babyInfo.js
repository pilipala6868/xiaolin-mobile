
//获取url参数
var urlPart = getUrlPart(window.location.href);
if (urlPart.id == undefined || urlPart.type == undefined)  //未获取到id参数，跳转回首页
	window.location.href = './index.html';

//左侧导航选中序数
var navigChosen = urlPart.type;

$(document).ready(function() {

	//获取后台数据
	$.ajax({
		type: 'GET',
		url: 'php/babyinfo.php?type=getInfo&baby_id='+urlPart.id,
		success: function(data) {
			var arrayData = jQuery.parseJSON(data);
			//宝贝详细信息
			var babyInfo = arrayData['babyInfo'];
			//详情换行处理
			babyInfo.intro = '<p>'+babyInfo.intro.split('\n').join("</p><p>")+'</p>';
			//详情链接处理
			var patt = /(http.*)(，|<\/p>)/g;
			var temp;
			if (temp = patt.exec(babyInfo.intro))
			{
				var babyInfoLink = temp[1];
				var babyInfoLinkWithA = "<a target='_blank' href='"+babyInfoLink+"'>"+babyInfoLink+"</a>";
				babyInfo.intro = babyInfo.intro.replace(babyInfoLink, babyInfoLinkWithA);
			}
			//其他乐器
			var otherInstrument = ['萨克斯', '小提琴', '长笛', '单簧管'];
			var otherInstrumentEng = ['Saxophone', 'Violin', 'Flute', 'Clarinet'];
			otherInstrument.splice(otherInstrumentEng.indexOf(babyInfo.instrument), 1);
			babyInfo.others = otherInstrument.join('、');
			//两张图片选_2
			if (babyInfo.picNum > 1)
				babyInfo.pic = babyInfo.pic.replace(/\.+/i, '_2.');

			//把板块数据几个一行分组
			var recommend = new Array();
			if (window.innerWidth > 1000)
				recommend.push(arrayData['recommend'].slice(0, 4));
			else if (window.innerWidth > 700)
				recommend.push(arrayData['recommend'].slice(0, 3));
			else
				recommend.push(arrayData['recommend'].slice(0, 2), arrayData['recommend'].slice(2, 4));

			//数据更新
			new Vue({
				el: '#mainBox',
				data: {
					babyInfo: babyInfo,
					recommends: recommend
				},
				mounted() {
					rightBind();  //same.js中的绑定事件
					//标签title修改
					$('title').text(babyInfo.name);
				}
			});
		}
	});

});

function addToCart(changetone = 0)
{
	//是否登录
	if ($.cookie('user_id') == undefined)
	{
		alert('请登录后再添加');
		window.location.href = 'login.html';
	}
	else
	{
		//添加到购物车
		$.ajax({
			type: 'GET',
			url: 'php/babyinfo.php?type=addCart&baby_id={0}&user_id={1}&changetone={2}'.format(urlPart.id, $.cookie('user_id'), changetone),
			success: function(data) {
				var returnData = jQuery.parseJSON(data);
				if (returnData)
					window.location.href = 'shoppingCart.html';
				else
					alert('该宝贝购物车中已存在');
			}
		});
	}
}