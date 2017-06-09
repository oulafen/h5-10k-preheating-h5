$(function(){
    //audio.pause();
    watermarker.hide();
    initFullpage();
    resetScale();
    $(window).resize(function(){
        resetScale();
    });
    $('.J-audio-control').on('click', function(e){
        e.preventDefault();
        var $_audioCtrlBtn = $(this);
        var is_open = $_audioCtrlBtn.hasClass('open');
        if(is_open){
            $_audioCtrlBtn.removeClass('open');
            audio.pause();
        }else{
            $_audioCtrlBtn.addClass('open');
            audio.play();
        }
    });
    $('.J-audio-control').on('touchend', function(e){
        e.preventDefault();
        var $_audioCtrlBtn = $(this);
        var is_open = $_audioCtrlBtn.hasClass('open');
        if(is_open){
            $_audioCtrlBtn.removeClass('open');
            audio.pause();
        }else{
            $_audioCtrlBtn.addClass('open');
            audio.play();
        }
    });

    preload('data-src', 'img', $('#loadLine'), null, function(){
        //所有图片加载完成
        $('.loading-box').addClass('animated fadeOut');
        $('#fullpage').show();
        if(global.browser().weixin){
            autoPlayAudio1();
        }
        setTimeout(function(){
            $('.loading-box').hide();
            $(".flipster").flipster({
                style: 'carousel',
                start: 0,
                enableNavButtons: true,
                prevText: '',
                nextText: ''
            });
        }, 30)
    });

});

function autoPlayAudio1() {
    wx.ready(function() {
        document.getElementById('music').load();
        $('.J-audio-control').click();
        document.getElementById('music').play();
    });
}

var audio =  {
    audioEl: document.getElementById('music'),
    play: function(){
        var self = this;
        self.audioEl.play();
    },
    pause: function(){
        var self = this;
        self.audioEl.pause();
    }
};

function initFullpage(){
    $('#fullpage').fullpage({
        loopBottom: false,
        afterRender: function(){
            resetAnimate(0);
        },
        onLeave: function (index, nextIndex, direction) {
            resetAnimate(nextIndex - 1);
            if($('.J-audio-control').hasClass('open')){
                audio.play();
            }
            //console.log('nextIndex-->', nextIndex);
            if(nextIndex > 1 && nextIndex < 8){
                watermarker.show();

                /** 为了解决新浪微博中, 到倒数第二页时, 出现最后一页的背景边的bug **/
                if(direction == 'down'){
                    $('.page8').css('background-image', 'none');
                }
                if(direction == 'up' && nextIndex == 7){
                    setTimeout(function(){
                        $('.page8').css('background-image', 'none');
                    }, 700)
                }
            }else{
                watermarker.hide();
                $('.page8').css('background-image', 'url(./src/images/bg_2.jpg)');
            }
        }
    });
}

function resetAnimate(index){
    var $_jsAnimate = $('.section').eq(index).find('.js-animate');
    $_jsAnimate.each(function() {
        $(this).removeClass($(this).data('animate')).hide();
    });
    setTimeout(function(){
        $_jsAnimate.each(function () {
            $(this).addClass($(this).data('animate')).show();
        });
    },500);
}

function resetScale(){
    var preW = 375;
    var preH = 600;
    var screenW = $(window).width();
    var screenH = $(window).height();
    var scale = screenW / preW; //缩放比
    //长宽比的差
    var diff_wh = preW / preH - screenW / screenH;
    if(diff_wh < 0){
        scale = screenH / preH;
    }
    $('.wrapper').css('-webkit-transform','translateX(-50%) scale('+scale+')')
        .css('-moz-transform','translateX(-50%) scale('+scale+')')
        .css('-ms-transform','translateX(-50%) scale('+scale+')')
        .css('-o-transform','translateX(-50%) scale('+scale+')')
        .css('transform','translateX(-50%) scale('+scale+')');
}

var watermarker = {
    'show': function(){
        $('.watermarker').show();
    },
    'hide': function(){
        $('.watermarker').hide();
    }
};

var global = {
    browser: function () {
        var u = navigator.userAgent;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1, //android终端
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq", //是否QQ
            lemon: u.indexOf('lemon') > -1, //是否柠檬app
            lemon_version: isNaN(parseFloat(u.substr(u.indexOf('version:') + 8, 5).replace('.', '')) / 10) ? 0 : (parseFloat(u.substr(u.indexOf('version:') + 8, 5).replace('.', '') / 10).toFixed(2) )
            /** 柠檬app的版本，结果为浮点型 x.x，获取不到时结果为0 **/
        }
    }
};
