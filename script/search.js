
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
var pageNum = 12;
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
				$('#babyAll').append("<div style='margin-top: 10px; margin-left: 15px;'>无搜索结果</div>");

			//把板块数据每4个一行分组
			var babyAll = new Array();
			var i = 0;
			for (; i<(arrayData['babyAll'].length/4)-1; i++)
				babyAll.push(arrayData['babyAll'].slice(i*4, i*4+4));
			babyAll.push(arrayData['babyAll'].slice(i*4, arrayData['babyAll'].length));

			//页码页数处理
			pageSum = Math.ceil(arrayData['babySum'] / pageNum);
			var pageNumbers = new Array();
			for (i=0; i<pageSum; i++)
				pageNumbers.push(i+1);
			
			//数据更新
			new Vue({
				el: '#rightBox',
				data: {
					babyAllRows: babyAll,
					keyWord: decodeURI(keyWord),
					numbers: pageNumbers,
					pageNow: pageNow,
					pageSum: pageSum,
				},
				mounted() {
					rightBind();  //same.js中的绑定事件
					rightDellWith();  //页码、排序等元素处理
				}
			});
		},
		error: function() {
			console.log('Ajax data error.');
		}
	});

});

//页码、排序等元素处理
function rightDellWith()
{
	//页码处理
	if (pageSum <= 1)
		$('#pageNumber').remove();
	//上一页
	if (pageNow == 1)
		$('.lastpage').remove();
	else
		$('.lastpage').attr('href', 'search.html?search={0}&page={1}'.format(keyWord, pageNow-1));
	//下一页
	if (pageNow == pageSum)
		$('.nextpage').remove();
	else
		$('.nextpage').attr('href', 'search.html?search={0}&page={1}'.format(keyWord, pageNow+1));
	//当前页码
	$('.number').eq(pageNow-1).removeClass('clickable');
	$('.number').eq(pageNow-1).removeAttr('href');
}
