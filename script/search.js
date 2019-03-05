
//获取url参数
var urlPart = getUrlPart(window.location.href);
if (urlPart.search == undefined)  //未获取到搜索关键字，跳转回首页
	window.location.href = './index.html';

//左侧导航选中
var navigChosen = 'all';
//顶部模块名
var pageName = '搜索结果';
//搜索关键字
var keyWord = urlPart.search;

//每页数量
var pageNum = 16;
//当前页数
var pageNow = parseInt(urlPart.page ? urlPart.page : 1);

$(document).ready(function() {

	//获取后台数据
	$.ajax({
		type: 'GET',
		url: 'php/search.php?keyWord={0}&pageNum={1}&pageNow={2}'.format(keyWord, pageNum, pageNow),
		success: function(data) {
			var arrayData = jQuery.parseJSON(data);

			//无搜索结果
			if (arrayData['babyAll'].length == 0)
				$('#babyAll').append("<div id='noResult'>无搜索结果</div>");

			//把板块数据几个一行分组
			var eachRowNum = 2;
			if (window.innerWidth > 1000)
				eachRowNum = 4;
			else if (window.innerWidth > 700)
				eachRowNum = 3;

			var babyAll = new Array();
			var babyRealSum = arrayData['babyAll'].length;  //真实传来的宝贝个数
			for (var i=0; i+eachRowNum<=21 && i<=babyRealSum; i+=eachRowNum)
				babyAll.push(arrayData['babyAll'].slice(i, i+eachRowNum));

			//页码页数处理
			pageSum = Math.ceil(arrayData['babySum'] / pageNum);
			var pageNumbers = new Array();
			for (i=0; i<pageSum; i++)
				pageNumbers.push(i+1);
			
			//数据更新
			new Vue({
				el: '#mainBox',
				data: {
					babyAllRows: babyAll,
					keyWord: decodeURI(keyWord),
					numbers: pageNumbers,
					pageNow: pageNow,
					pageSum: pageSum,
				},
				mounted() {
					rightBind();  //same.js中的绑定事件
					rightDellWith();  //页码处理
					(function() {  //babyBox最后一行个数不满
						var lastRowNum = $('.row').eq(-1).children().length;
						var lastEachWidth = $('.row').eq(-1).children().outerWidth(true);
						if (lastRowNum != eachRowNum)
						{
							for (var i=0; i<eachRowNum-lastRowNum; i++)
								$('.row').eq(-1).append("<div style='width:{0}px;'></div>".format(lastEachWidth));
						}
					})();
				}
			});
		}
	});

});

//页码处理
function rightDellWith()
{
	//当前页码
	$('.number').eq(pageNow-1).removeClass('clickable');
	$('.number').eq(pageNow-1).removeAttr('href');

	//只有一页
	if (pageSum <= 1)
		$('#pageNumber').remove();
	//页码太多
	if (pageSum > 6)
	{
		if (pageNow <= 4)  //最左
		{
			for (var i=7; i<pageSum; i++)
				$('a.number').eq(7).remove();
			$('a.number').eq(-1).after('<span>...</span>');
		}
		else if (pageNow >= pageSum-3)  //最右
		{
			for (var i=0; i<pageSum-7; i++)
				$('a.number').eq(0).remove();
			$('.lastpage').eq(0).after('<span>...</span>');
		}
		else
		{
			for (var i=0; i<pageNow-4; i++)
				$('a.number').eq(0).remove();
			for (i=7; i<pageSum; i++)
				$('a.number').eq(7).remove();
			$('.lastpage').after('<span>...</span>');
			$('a.number').eq(-1).after('<span>...</span>');
		}
	}

	//上一页
	if (pageNow == 1)
		$('.lastpage').remove();
	else
		$('.lastpage').attr('href', 'babylist.html?type={0}&page={1}&sortWay={2}'.format(navigChosen, pageNow-1, pageSort));
	//下一页
	if (pageNow == pageSum)
		$('.nextpage').remove();
	else
		$('.nextpage').attr('href', 'babylist.html?type={0}&page={1}&sortWay={2}'.format(navigChosen, pageNow+1, pageSort));
}
