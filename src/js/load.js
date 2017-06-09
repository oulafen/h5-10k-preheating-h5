!function () {
    var t = function (t) {
        if (typeof t != "function") throw new Error("Invalid callback");
        this.cb = t;
        this.images = [];
        this.sounds = [];
        this.__cachedSnds = {};
    };
    t.prototype.addImage = function (t) {
        this.images.push(t)
    };
    t.prototype.addSound = function (t) {
        this.sounds.push(t)
    };
    t.prototype.addImages = function (t) {
        "object" == typeof t && t.length && (this.images = this.images.concat(t))
    };
    t.prototype.addSounds = function (t) {
        "object" == typeof t && t.length && (this.sounds = this.sounds.concat(t))
    };
    t.prototype.load = function () {
        for (var t = this.images.length, o = 0, n = this.sounds.length, i = this.cb, s = t + n, e = function () {
            o++, i("progress", o / s), o == s && i("complete")
        }, r = 0; r < this.images.length; r++) {
            var h = new Image;
            h.onload = function () {
                this.onload = null, e()
            }, h.onerror = function () {
                this.onerror = null, i("error", this.src), e()
            }, h.src = this.images[r]
        }
        var u = this;
        for (r = 0; r < this.sounds.length; r++) {
            var a = this.sounds[r],
                c = new Audio(a);
            c.__dturl = a, c.oncanplaythrough = function () {
                clearTimeout(this.__timeoutId), this.oncanplaythrough = null, this.onerror = null, u.__cachedSnds[this.__dturl] = this, e()
            }, c.onerror = function () {
                clearTimeout(this.__timeoutId), this.oncanplaythrough = null, this.onerror = null, i("error", this.__dturl), e()
            }, c.__timeoutId = setTimeout(function (t) {
                t.oncanplaythrough()
            }, 100, c), c.load()
        }
    };
    t.prototype.getSound = function (t) {
        return this.__cachedSnds[t] || null
    };
    window.Preloader = {
        create: function (o) {
            return new t(o)
        }
    }
}();

/*
 *sourse：需要加载的资源 type Array  eg:['./images/aaa.png',.....]
 *end：加载完成后的回调函数	type Function
 return：null;
 */
function _load(sourse, obj1, obj2, callback, end) {
    //设置默认值
    sourse = sourse || [];

    var loader = Preloader.create(function (type, val) {
        switch (type) {
            case "complete":
                //加载完成后的动作break;
                end && end();
                callback && callback();
                break;
            case "progress":
                //加载过程中的动作
                if (obj1) {
                    obj1.style.width = val * 100 + "%";
                }
                //console.log(val);
                if (val && obj2) {
                    obj2.innerHTML = Math.floor(val * 100) + "%";
                }
                break;
        }
    });
    loader.addImages(sourse);
    loader.load();
}
//检测对象的类型，是原生对象还是Zepto对象
/*
 *如果是Zepto对象就返回true,否则返回false;
 */
function isObj(obj) {
    //console.log(obj instanceof Object)
    if (obj instanceof Object) {
        return true;
    }
    else if (obj instanceof HTMLElement) {
        return false;
    }
}

/* 
 *dataSrc：存放图片路径的自定义属性，type  String
 *type：类型，指定是'bg'还是'img'  	type  String
 *obj1：进度条元素，  type  Object
 *obj2：进度条百分比元素   type Object;
 return：null;
 */
function preload(dataSrc, type, obj1, obj2, callback) {
    //设置默认值
    dataSrc = dataSrc || '';
    type = type || 'img';
    obj1 = obj1 || null;
    obj2 = obj2 || null;
    if (obj1 || obj2) {
        if (obj1) {
            if (isObj(obj1)) {
                obj1 = obj1[0];
            } else {
                obj1 = obj1;
            }
        }
        if (obj2) {
            if (isObj(obj2)) {
                obj2 = obj2[0]
            } else {
                obj2 = obj2;
            }
        }
    }
    //储存图片路径的数组
    var arr = [];

    //通过自定义属性获取对象
    var aImg = document.querySelectorAll('[' + dataSrc + ']');

    //循环拿到所有对象的自定义属性
    for (var i = 0; i < aImg.length; i++) {
        arr.push(aImg[i].getAttribute(dataSrc));
    }

    //判断图片类型是否为img，
    if (type == 'img') {
        _load(arr, obj1, obj2, callback, function () {
            for (var i = 0; i < arr.length; i++) {
                aImg[i].src = arr[i];
            }
        });
    }
    //不是img的时候就是bg,背景图
    else {
        _load(arr, obj1, obj2, callback, function () {
            for (var i = 0; i < arr.length; i++) {
                aImg[i].style.backgroundImage = 'url(' + arr[i] + ')';
            }
        });
    }
}
