
//左侧导航选中序数
var navigChosen = 'index';

$(document).ready(function() {

	//获取后台数据
	$.ajax({
		type: 'GET',
		url: 'php/indexpage.php?num=9',
		success: function(data) {
			var arrayData = jQuery.parseJSON(data);

			//轮播图数据处理
			var slider = arrayData['slider'];
			slider[slider.length-1].class = 'slideImg1';
			slider[0].class = 'slideImg2';
			slider[1].class = 'slideImg3';
			for(var i=2; i<slider.length-1; i++)
				slider[i].class = 'slideImg4';

			//把板块数据几个一行分组
			var eachRowNum = 2;
			if (window.innerWidth > 1000)
				eachRowNum = 4;
			else if (window.innerWidth > 700)
				eachRowNum = 3;

			var newest = new Array();
			var recommend = new Array();
			for (var i=0; i+eachRowNum<=9; i+=eachRowNum)
			{
				newest.push(arrayData['newest'].slice(i, i+eachRowNum));
				recommend.push(arrayData['recommend'].slice(i, i+eachRowNum));
			}
			
			//数据更新
			new Vue({
				el: '#mainBox',
				data: {
					sliders: slider,
					newestRows: newest,
					recommendRows: recommend
				},
				mounted() {
					goSlide(3000);  //vue挂载完成后再调用轮播相关的js
					rightBind();  //same.js中的绑定事件
				}
			});
		}
	});

});
