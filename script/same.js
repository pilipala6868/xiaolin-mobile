
//导航名称列表
var navigList = ['index', 'login', 'all', 'monthlyupdate', 'saxophone', 'quartet', 'flute', 'violin', 'clarinet', 'trumpet', 'accompaniment', 'about'];
var navigListCh = ['首页', '登录', '所有宝贝', '每月更新', '萨克斯', '二重奏/多重奏', '长笛', '小提琴', '单簧管', '小号', '伴奏旋律谱', '关于小林'];

$(document).ready(function() {

	//检测是否为电脑端
    if (!navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))
    {
    	$('body').html('');
        window.location.href = window.location.href.replace('mxiaolin', 'xiaolin');
    }

	//加载左侧导航
	$('#leftBox').load('leftBox.html', function() {

		//左侧子导航链接添加序数
		$('.ul_inside').each(function() {
			var aElements = $(this).find('a');
			for (var i=0; i<aElements.length; i++)
				aElements.eq(i).attr('href', aElements.eq(i).attr('href') + '_' + i);
		});

		//左侧导航选中
		if (navigChosen != 0)
		{
			if (navigChosen.search('_') > -1)  //参数带有子导航
			{
				var fatherNavig = navigChosen.split('_')[0];
				//父导航选中
				$('.navigs:eq('+(navigList.indexOf(fatherNavig))+')').addClass('chosen_navig');
				//子导航选中
				var childChosenNavig = $('.chosen_navig').find('.ul_inside li').eq(childNavigIndex).children('a');
				childChosenNavig.css({
					'color': '#333', 
					'font-weight': 'bold'
				});
				//顶部模块名称补充添加
				pageName += ' > ' + childChosenNavig.text();
				$('#pageName h2').text(pageName);
			}
			else 
			{
				$('.navigs:eq('+(navigList.indexOf(navigChosen.toLowerCase()))+')').addClass('chosen_navig');
			}
		}

		//cookie检测
		if ($.cookie('user_id') != undefined)
		{
			var leftNavig = $('#leftBox .navigs').eq(1);
			leftNavig.children('a').attr('href', 'personal.html');
			leftNavig.children('a').children('span').text('个人中心');
		}

	});

	//加载顶部
    $('#headlineBox').load('headline.html', function() {
		//侧滑板块
	    $('#leftBox').leftMenu({
	        "triggerBtn": ".leftBoxBtn"
	    }).init();

	    //点击搜索按钮
		$('#header_search').click(function() {
			if ($('#header_searchBox').css('display') == 'none')
			{
				$('#header_searchBox').slideDown(200).css('display', 'flex');
				$(this).children('i').attr('class', 'fa fa-caret-up');
			}
			else
			{
				$('#header_searchBox').slideUp(200);
				$(this).children('i').attr('class', 'fa fa-search');
			}
		});

		//顶部input提交搜索
		$('#header_searchBox i').click(function() {
			var searchVal = $.trim($('#header_searchBox input').val());
			if (searchVal != '' && searchVal != '搜索')
				window.location.href = './search.html?search=' + searchVal;
		});
    });

	//加载尾部
	$('#footer').load('footer.html');

});

//rightBox中需要在vue渲染后再绑定的事件
function rightBind()
{
	//若屏幕尺寸大，重新设定babyBox宽度占比
	if (window.innerWidth > 1000)
		$('.babyBox').css('width', '24%');
	else if (window.innerWidth > 700)
		$('.babyBox').css('width', '33%');
	//babyBox图片高度设定
	$('.babyImg').height($('.babyImg').width()*0.5);

	//babyBox文字行数超过两行缩略
	var maxLineHeight = parseFloat($('.babyBox .babySpan').css('line-height')) * 2.5;
	var tempSpan;
	$('.babyBox .babySpan').each(function(index) {
		while ($(this).height() > maxLineHeight)
		{
			tempSpan = $(this).text().slice(0, -4);
			$(this).text(tempSpan + '..');
		}
	});

    //顶部板块名字填入
    if ($('#pageName h2').length > 0)
    	$('#pageName h2').text(pageName);
}

//获取URL参数
function getUrlPart(url)
{
	url = url.replace(/#$/, '');  //去掉有时url末尾有的#
	var patt = /[?&](.*?)=([^&]*)/g;
	var result = new Array();
	var temp;
	while(temp = patt.exec(url))
		result[temp[1]] = temp[2];
	return result;
}

//字符串内变量替换
String.prototype.format = function() {
    //数据长度为空，则直接返回
    if (arguments.length == 0)
        return this;
 
    //使用正则表达式，循环替换占位符数据
    for (var r=this, i=0; i<arguments.length; i++)
        r = r.replace(new RegExp("\\{" + i + "\\}", "g"), arguments[i]);
    return r;
}

//等待$(_this)元素加载完成后，执行func函数，间隔waitTime判断一次
function waitForLoading(_this, func, waitTime)
{
	if ($(_this).length == 0)
		setTimeout(function() { 
			waitForLoading($(_this), func, waitTime);
		}, waitTime);
	else
		func();  //加载完成，执行相应函数
}

//数值显示小数点后两位
function toDecimal2(num) {  
    var num = parseFloat(num);  
    if (isNaN(num)) {  
        return false;  
    }  
    var num = Math.round(num * 100) / 100;  
    var stringNum = num.toString();
    var pointIndex = stringNum.indexOf('.');  
    if (pointIndex < 0) 
        stringNum += '.00';
    else
	    while (stringNum.length <= pointIndex + 2)
	        stringNum += '0';
    return stringNum;  
}