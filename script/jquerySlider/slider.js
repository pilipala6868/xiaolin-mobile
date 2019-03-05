
function goSlide(sliderSpeed = 4000)
{
    //轮播盒宽高度设定
    var iWidth = window.innerWidth;  //页面宽度
    $('.slider').width(iWidth);
    $('.slider, .slideBox').height((iWidth-20) * 0.33);
    var imgSum = $('.slideImg').length;  //轮播图总数
    $('.slideBox').width(iWidth * 3);
    $('.slideBox div').width(iWidth - $('.slideImg img').css('margin-left').slice(0, -2)*2);
    
    //slideImg几个类的left值给定
    var tempStyle = "<style type='text/css'>\
        .slideImg1 { left: " + -iWidth + "px; }\
        .slideImg3 { left: " + iWidth + "px; }\
    </style>";
    $(tempStyle).appendTo('head');

    //下方方块按钮
    $('.slideImg').each(function() {
        $('.slideBt').append($('<span></span>'));
    })

    //自动轮播
    var slideGo = setInterval(swipeleftFunc, sliderSpeed);

    var mIndex = 0;  //正居中展示的图片index

    //下方圆点随轮播变化
    function slideBtUpdate()
    {
        $('.lightUp').removeClass('lightUp');
        $('.slideBt span').eq(mIndex).addClass('lightUp');
    }
    slideBtUpdate();


    //检测滑动事件
    $('.slideBox').on('touchstart', function(e) {
        startX = e.touches[0].screenX;
        newTouch = true;  //新触摸，否则可能一次触摸造成多次图片移动
    })
    $('.slideBox').on('touchmove', function(e) {
        movingX = e.touches[0].screenX;
        if (newTouch)
        {
            //左滑
            if (startX - movingX > 80)
            {
                newTouch = false;
                swipeleftFunc();
                clearInterval(slideGo);
                slideGo = setInterval(swipeleftFunc, sliderSpeed);
            }
            //右滑
            else if (movingX - startX > 80)
            {
                newTouch = false;
                swiperightFunc();
                clearInterval(slideGo);
                slideGo = setInterval(swipeleftFunc, sliderSpeed);
            }
        }
    });

    //左移
    function swipeleftFunc()
    {
        //class变化移位
        mIndex = mIndex==imgSum-1 ? 0 : mIndex+1;
        $('.slideImg').eq(mIndex-2).addClass('slideImg4').removeClass('slideImg1');
        $('.slideImg').eq(mIndex-1).addClass('slideImg1').removeClass('slideImg2');
        $('.slideImg').eq(mIndex).addClass('slideImg2').removeClass('slideImg3');
        if (mIndex == imgSum-1)
            $('.slideImg').eq(0).addClass('slideImg3').removeClass('slideImg4');
        else
            $('.slideImg').eq(mIndex+1).addClass('slideImg3').removeClass('slideImg4');
        //下方圆点变化
        slideBtUpdate();
    }

    //右移
    function swiperightFunc()
    {
        //class变化移位
        $('.slideImg').eq(mIndex-2).addClass('slideImg1').removeClass('slideImg4');
        $('.slideImg').eq(mIndex-1).addClass('slideImg2').removeClass('slideImg1');
        $('.slideImg').eq(mIndex).addClass('slideImg3').removeClass('slideImg2');
        if (mIndex == imgSum-1)
            $('.slideImg').eq(0).addClass('slideImg4').removeClass('slideImg3');
        else
            $('.slideImg').eq(mIndex+1).addClass('slideImg4').removeClass('slideImg3');
        mIndex = mIndex==0 ? imgSum-1 : mIndex-1;
        //下方圆点变化
        slideBtUpdate();
    }
}
