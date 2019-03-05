;(function ($) {
    var LM = function (ele, options) {
        this.$element = ele
        this.defaults = {}
        this.settings = $.extend({}, this.defaults, options)
    }
    LM.prototype = {
        menu : function () {
            var _this = this.$element
            var LI_HEIGHT = _this.find('.f2 li').outerHeight(true)
            $('.menu-dark-backdrop').on('click', function () {
                if (_this.hasClass('menu-open')) {
                    _this.removeClass('menu-open')
                    $('.menu-dark-backdrop').removeClass('in').off()
                    $('body').css("overflow", "auto")
                    _this.find('li.hasChild').removeClass('open').off().find('div').css({ "height": 0 })
                    _this.find('li.hasChild .fa-angle-up').attr('class', 'fa fa-angle-down');  //其他li上拉标志变化
                    _this.scrollTop(0)
                } else {
                    _this.addClass('menu-open')
                    $('.menu-dark-backdrop').addClass('in')
                    $('body').css("overflow", "hidden")
                }
            })
            _this.find('li.hasChild').on('click', function (e) {
                /*判断点击的目标*/
                if ($(e.target)[0].nodeName == 'LI') {
                    var et = $(e.target)
                } else {
                    var et = $(e.target).parent()
                    while (et[0].nodeName != 'LI') {
                        et = et.parent()
                    }
                }
                location.href = et.find('a').eq(0).attr("href")

                if ($(et).hasClass('open')) {
                    $(et).removeClass('open').find('li').removeClass('open')
                } else {
                    $(et).addClass('open').siblings().removeClass('open').find('li').removeClass('open')
                }

                /*li下拉动画展示 计算并设置div的height*/
                var _index = $(et).children().eq(1).children().children().length
                if (!$(et).hasClass('open')) {
                    $(et).children().eq(1).css({ "height": 0 })
                    $(et).find('div').css({ "height": 0 })
                    $(et).children('a').children('.fa-angle-up').attr('class', 'fa fa-angle-down');  //上拉标志变化
                    if ($(et).parent().parent().hasClass("f2")) {
                        var _parentHeight = $(et).parent().children().length * LI_HEIGHT
                        $(et).parent().parent().css({ "height": _parentHeight + "px" })
                    }
                } else {
                    var _divHeight = _index * LI_HEIGHT;  //加上全部上边框和余地
                    $(et).children().eq(1).css({ "height": _divHeight + "px" })
                    $(et).children('a').children('.fa-angle-down').attr('class', 'fa fa-angle-up');  //下拉标志变化
                    if ($(et).parent().parent().hasClass("f2")) {
                        var _parentHeight = $(et).parent().children().length * LI_HEIGHT
                        _parentHeight = parseInt(_parentHeight) + _divHeight
                        $(et).parent().parent().css({ "height": _parentHeight + "px" })
                    }
                    $(et).siblings().find('div').css({ "height": 0 })
                    $(et).siblings().find('.fa-angle-up').attr('class', 'fa fa-angle-down');  //其他li上拉标志变化
                }
                if(e && e.stopPropagation) {
                    e.stopPropagation()
                } else {
                    window.event.cancelBubble = true
                }
                e.preventDefault()
            })
        },
        init: function () {
            var $btn = $(this.settings.triggerBtn)
            var obj = this
            $btn.click(function () {
                if (!$('body').find('div').hasClass('menu-dark-backdrop')) {
                    $('body').prepend('<div class="menu-dark-backdrop"></div>')
                }
                if (obj.$element.hasClass('menu-open')) {
                    obj.$element.removeClass('menu-open')
                    $('.menu-dark-backdrop').removeClass('in').off()
                    $('body').css({ "overflow": "auto" })
                    $('body').css("overflow", "auto")
                    obj.$element.find('li').removeClass('open').off().find('div').css({ "height": 0 })
                    obj.$element.scrollTop(0)
                } else {
                    obj.$element.addClass('leftMenu').addClass('menu-open')
                    $('.menu-dark-backdrop').addClass('in')
                    $('body').css({"overflow":"hidden"})
                    obj.menu()
                }
            })
        }
    }

    $.fn.leftMenu = function (options) {
        var lm = new LM(this, options)
        lm.$element.addClass('leftMenu')
        return lm
    }
}(jQuery))