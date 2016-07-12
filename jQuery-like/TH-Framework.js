/**
 * Created by Torooria Hyperion on 2016/2/16.
 */


!function (window) {
    //  全局trim功能
    var trimAll = function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '');
    };

    var pushTo = function (obj) {
        this[this.length++] = obj;
    };

    var mySlice = [].slice;

    var myShift = [].shift;

    var myUnshift = [].unshift;
    //var pushTo = [].push;

    //  全局隐式遍历
    var ysbl = function (fn, argu) {
        if (!this.length) {
            this[fn].apply(this, argu);
        } else {
            if (typeof fn == "string") {
                for (var i = 0; i < this.length; i++) {
                    this[i][fn].apply(this[i], argu);
                }
            }
            else {
                for (i = 0; i < this.length; i++) {
                    fn.apply(this[i], argu);
                }
            }
        }
    };

    //  清除数组重复项
    function uit(c) {
        for (var i = 0; i < c.length - 1; i++) {
            for (var j = i + 1; j < c.length; j++) {
                if (c[i] === c[j]) {
                    c = c.slice(0, j).concat(c.slice(j + 1, c.length));
                }
            }
        }
        return c;
    }

    //  支持TH(selector)形式
    var TH = function (selector, context) {
        if(typeof selector == "function") {
            window.onload = selector;
        }
        else {
            return new TH.prototype.init(selector, context);
        }
    };

    TH.prototype = {
        constructor: TH,
        length: 0,
        selector: "",
        context: window.document,
        end: function () {
            return this.prevObject;
        },
        extend: function (target, data) {
            for (var i in data) {
                target.prototype[i] = data[i];
            }
            return target;
        },
        addDoms: function (target,eles) {
            var len = +eles.length,
                j = 0,
                i = target.length;
            while (j < len) {
                target[i++] = eles[j++];
            }
            target.length = i;
            return target;
        },
        pushStack: function (eles) {
            var nextTH = this.addDoms(this.constructor(),eles);
            nextTH.prevObject = this;
            nextTH.context = this.context;
            nextTH.animationQueue = {length:0};
            return nextTH;
        },
        eq: function (i) {
            var len = this.length,
                j = +i + ( i < 0 ? len : 0 );
            return this.pushStack(j >= 0 && j < len ? [this[j]] : []);
        },
        first: function () {
            return this.eq(0);
        },
        last: function () {
            return this.eq(-1);
        },
        find: function (selector) {
            return document.querySelectorAll?
                this.pushStack(this.sel5(this.selector + " " + selector),this):
                this.pushStack(this.sel(selector,this));
        },
        children: function (selector) {
            var ret = [];
            if(document.querySelectorAll) {
                selector = selector?" > " + selector:' > *';
                console.log(this.selector + selector);
                ret = document.querySelectorAll(this.selector + selector);
            }
            else {
                var that = this;
                this.bl(function () {
                    var t = this.children;
                    if(selector) {
                        for(var i= 0,len = t.length;i< len;i++) {
                            var tg = true;
                            var id = true;
                            if(selector.charAt(0) == "#") {
                                id = t[i].id == selector.substr(1);
                            }
                            else if(selector.charAt(0) != ".") {
                                tg = t[i].nodeName == selector.toUpperCase();
                            }
                            var cl = that.hasClass.apply(t[i],[selector.substr(1)]);
                            if(!tg || !id || !cl) {
                                t = len == 1?[]:mySlice.apply(t,[0,i]).concat(mySlice.apply(t,[i+1]));
                                i--;
                                len--;
                                if(i==-1 && len == 0) {
                                    break;
                                }
                            }
                        }
                    }
                    if(!t.length) {
                    }
                    else if(t.length == 1) {
                        ret.push(t[0]);
                    }
                    else {
                        for(var index=0;index< t.length;index++) {
                            if(t[index].nodeType != 1){
                                //t = t.slice(0,index - 1).concat(t.slice(index));
                                t = mySlice.apply(t,[0,index-1]).concat(mySlice.apply(t,[index]));
                                index --;
                            }
                        }
                        for(i = 0;i< t.length;i++) {
                            ret.push(t[i]);
                        }
                    }
                },[]);
            }
            return this.pushStack(ret);
        },
        parent: function () {
            return this.pushStack([getParent(this[0])]);
            function getParent(obj) {
                return obj.parentNode;
            }
        },
        siblings: function () {
            return this.pushStack(getSiblings(this[0]));
            function getSiblings(o){
                //参数o就是想取谁的兄弟节点，就把那个元素传进去
                var a=[];//定义一个数组，用来存o的兄弟元素
                var p=o.previousSibling;
                while(p){//先取o的哥哥们 判断有没有上一个哥哥元素，如果有则往下执行  p表示previousSibling
                    if(p.nodeType===1){
                        a.push(p);
                    }
                    p=p.previousSibling;//最后把上一个节点赋给p
                }
                a.reverse();//把顺序反转一下 这样元素的顺序就是按先后的了
                var n=o.nextSibling;//再取o的弟弟
                while(n){//判断有没有下一个弟弟结点 n是nextSibling的意思
                    if(n.nodeType===1){
                        a.push(n);
                    }
                    n=n.nextSibling;
                }
                return a;//最后按从老大到老小的顺序，把这一组元素返回
            }
        },
        get: function (num) {
            num = num<0?num+this.length:num;
            return this[num]?this[num]:null;
        },
        appendTo: function (target) {
            var ret;
            if(target.constructor === TH) {
                ret = target;
            }
            else {
                ret = TH(target);
            }
            var newTH = this.pushStack(ret);
            newTH.append(this);
            return newTH;
        },
        append: function (children) {
            var ret;
            if(children.constructor === TH) {
                ret = children;
            }
            else {
                ret = TH(children);
            }
            this.bl(function (child) {
                if(child.length) {
                    for(var i=0;i<child.length;i++) {
                        this.appendChild(child[i]);
                    }
                }
                else {
                    this.appendChild(child);
                }
            },[ret]);
            return this;
        },
        prepend: function (children) {
            var that = this;
            var ret;
            if(children.constructor === TH) {
                ret = children;
            }
            else {
                ret = TH(children);
            }
            this.bl(function (child) {
                if(child.length) {
                    for(var i=child.length - 1;i>=0;i--) {
                        that[0].parentNode.insertBefore(child[i],this);
                        myUnshift.apply(that,child[i]);
                    }
                }
                else {
                    that[0].parentNode.insertBefore(child,this);
                    myUnshift.apply(that,child);
                }
            },[ret]);
            return this;
        },
        prependTo: function (target) {
            var ret;
            if(target.constructor === TH) {
                ret = target;
            }
            else {
                ret = TH(target);
            }
            var newTH = this.pushStack(ret);
            newTH.prepend(this);
            return newTH;
        },
        insertBefore: function (target) {
            var that = this;
            var ret;
            if(target.constructor === TH) {
                ret = target;
            }
            else {
                ret = TH(target);
            }
            ret.bl(function () {
                for(var i = that.length - 1;i>=0;i--) {
                    this.parentNode.insertBefore(that[i],this);
                }
            },[ret]);
            return this.pushStack(ret);
        },
        insertAfter: function (target) {
            var that = this;
            var ret;
            if(target.constructor === TH) {
                ret = target;
            }
            else {
                ret = TH(target);
            }
            ret.bl(function () {
                var next = this.nextSibling || false;
                for(var i = that.length - 1;i>=0;i--) {
                    if(next) {
                        this.parentNode.insertBefore(that[i],next);
                    }
                    else {
                        this.parentNode.appendChild(that[i]);
                    }
                }
            },[ret]);
            return this.pushStack(ret);
        },
        replaceWith: function (obj) {
            //var that = this;
            //var ret;
            //if(obj.constructor === TH) {
            //    ret = obj;
            //}
            //else {
            //    ret = TH(obj);
            //}
            //this.bl(function (obj) {
            //    this.outerHTML = obj.outerHTML;
            //},[ret[0]]);
        },
        replaceAll: function (target) {
            //var ret;
            //if(target.constructor === TH) {
            //    ret = target;
            //}
            //else {
            //    ret = TH(target);
            //}
            //for(var i = 0;i<ret.length;i++) {
            //    var d = this[0]
            //    ret[i].outerHTML = d.outerHTML;
            //}
            //return this.pushStack(ret);
        }
    };

    TH.prototype.push = function (obj) {
        this[this.length++] = obj;
    };

    TH.extend = TH.prototype.extend;

    TH.prototype.init = function (selector, context) {
        if (!selector) {
            return this;
        }

        if (/^(\[object HTML)([a-zA-Z]*)(Element\])$/.test(selector.toString())) {
            this.push(selector);
        }
        else {
            //var doms = this.sel(trimAll(selector).split(' '));
            var doms = document.querySelectorAll?
                this.sel5(selector):
                this.sel(trimAll(selector).split(' '));
            for (var i = 0; i < doms.length; i++) {
                this.push(doms[i]);
            }
            this.animationQueue = {length:0};
            this.selector = selector;
            this.context = this.context || context;
        }
    };

//  Basic engine
    TH.prototype.extend(TH, {
        ajax: function (url, fn) {
            var xhr = createXHR();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        fn(xhr.responseText);
                    } else {
                        alert("错误的文件！");
                    }
                }
            };
            xhr.open("get", url, true);
            xhr.send();

            function createXHR() {
                //本函数来自于《JavaScript高级程序设计 第3版》第21章
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                } else if (typeof ActiveXObject != "undefined") {
                    if (typeof arguments.callee.activeXString != "string") {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"
                            ],
                            i, len;

                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {
                                //skip
                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                } else {
                    throw new Error("No XHR object available.");
                }
            }
        },
        random: function (start, end) {
            return Math.floor(Math.random() * (end - start)) + start;
        },
        trimL: function (str) {
            return str.replace(/(^\s*)/g, '');
        },
        trimR: function (str) {
            return str.replace(/(\s*$)/g, '');
        },
        trim: function (str) {
            return str.replace(/(^\s*)(\s*$)/g, '');
        },
        formateString: function (str, data) {
            return str.replace(/@\((\w+)\)/g, function (match, key) {
                return data[key];
            });
        }
    });

//  隐式遍历
    TH.prototype.bl = function (fn, argu) {
        if (typeof fn == "string") {
            for (var i = 0; i < this.length; i++) {
                this[i][fn].apply(this[i], argu);
            }
        }
        else {
            for (i = 0; i < this.length; i++) {
                fn.apply(this[i], argu);
            }
        }
    };

//  DataType
    TH.prototype.extend(TH, {
        isString: function (a) {
            return (typeof a) === "string" && isFinite(a);
        },
        isNumber: function (a) {
            return (typeof a) === "number";
        },
        isBool: function (a) {
            return (typeof a) === "boolean";
        },
        isUndefined: function (val) {
            return typeof val === "undefined";
        },
        isObj: function (str) {
            if (str === null || typeof str === 'undefined') {
                return false;
            }
            return typeof str === 'object';
        },
        isNull: function (val) {
            return val === null;
        },
        isArray: function (arr) {
            if (arr === null || typeof arr === 'undefined') {
                return false;
            }
            return arr.constructor === Array;
        }
    });

//  Selector
    var THselector = (function (window) {
        //  选择器正则匹配
        var tag_cl = /^([^.]+|[^#]+)\.([^.]+|[^#]+)$/;
        var tag_id = /^([^.]+|[^#]+)#([^.]+|[^#]+)$/;
        var id = /^#/;
        var cl = /^\./;

        function THselector() {

        }

        //  基本Class选择器
        function getClass(className, context) {
            var t;
            if (context.getElementsByClassName) {
                t = context.getElementsByClassName(className);
            } else {
                //  兼容性
                var p = [];
                var dom = context.getElementsByTagName('*');
                for (var i = 0, len = dom.length; i < len; i++) {
                    if (dom[i].className) {
                        //  将类名分割为数组
                        var cn = dom[i].className.split(' ');
                        //  标记是否存在类名=a
                        var flag = false;
                        for (var j = 0; j < cn.length; j++) {
                            if (trim(cn[j]) == className) {
                                flag = true;
                            }
                        }
                        //  存在,则添加到输出数组中
                        if (flag) {
                            p.push(dom[i]);
                        }
                    }
                }
                t = p;
            }
            if (t.length == 1) {
                return t[0];
            }
            else {
                var n = [];
                for (i = 0; i < t.length; i++) {
                    n.push(t[i]);
                }
                return n;
            }
        }

        //  遍历Class选择器
        function getC(className, context) {
            context = context || window.document;
            if (context.length) {
                var n = [];
                for (var i = 0; i < context.length; i++) {
                    var t = getClass(className, context[i]);
                    if (t.length) {
                        for (var j = 0; j < t.length; j++) {
                            n.push(t[j]);
                        }
                    }
                    else if (t.length != 0) {
                        n.push(t);
                    }
                }
                n = uit(n);
                return n;
            }
            else {
                return getClass(className, context);
            }
        }

        //  遍历Tag选择器
        function getT(tagName, context) {
            context = context || window.document;
            if (context.length) {
                var n = [];
                for (var i = 0; i < context.length; i++) {
                    var t = getTag(tagName, context[i]);
                    if (t.length) {
                        for (var j = 0; j < t.length; j++) {
                            n.push(t[j]);
                        }
                    }
                    else if (t.length != 0) {
                        n.push(t);
                    }
                }
                n = uit(n);
                return n;
            }
            else {
                return getTag(tagName, context);
            }
        }

        //  基础Tag选择器
        function getTag(tagName, context) {
            var t = context.getElementsByTagName(tagName);
            if (t.length == 1) {
                return t[0];
            }
            else {
                var n = [];
                for (var i = 0; i < t.length; i++) {
                    n.push(t[i]);
                }
                return n;
            }
        }

        //  ID选择器
        function getI(a) {
            return window.document.getElementById(a);
        }

        //  层级选择器
        THselector.sel = function (selector,cont) {
            var context = cont || window.document;
            var isArray = selector.constructor === Array;
            for (var i = 0,len = isArray?selector.length:1; i < len; i++) {
                var result = [];
                var sel = trimAll(isArray?selector[i]:selector);
                if (id.test(sel)) {
                    //console.log("进入ID");
                    result.push(getI(sel.substr(1)));
                } else if (tag_id.test(sel)) {
                    var c = sel.substr(0, sel.indexOf("#")).toUpperCase();
                    sel = sel.substr(sel.indexOf("#") + 1);
                    var t = getI(sel);
                    if (t.tagName != c) {
                        console.log("Error elements selector don't exist");
                        return;
                    }
                    result.push(t);
                } else if (cl.test(sel)) {
                    //console.log("进入cl");
                    t = getC(sel.substr(1), context);
                    if (t.length) {
                        for (var j = 0; j < t.length; j++) {
                            result.push(t[j]);
                        }
                    }
                    else {
                        result.push(t);
                    }
                } else if (tag_cl.test(sel)) {
                    //console.log("进入tag_cl");
                    c = sel.substr(0, sel.indexOf(".")).toUpperCase();
                    sel = sel.substr(sel.indexOf(".") + 1);
                    t = getC(sel, context);
                    if (t.length == 1) {
                        if (t.tagName != c) {
                            console.log("Error elements selector don't exist");
                            return;
                        }
                        result.push(t);
                    }
                    else {
                        var n = [];
                        for (j = 0; j < t.length; j++) {
                            if (t[j].tagName == c) {
                                n.push(t[j]);
                            }
                        }
                        if (!n.length) {
                            return;
                        }
                        for (j = 0; j < n.length; j++) {
                            result.push(n[j]);
                        }
                    }
                } else if (sel != "") {
                    //console.log("进入tag");
                    t = getT(sel, context);
                    if (t.length) {
                        for (j = 0; j < t.length; j++) {
                            result.push(t[j]);
                        }
                    }
                    else {
                        result.push(t);
                    }
                }
                else {
                    //console.log("返回");
                }
                context = result;
            }
            return context;
        };
        THselector.sel5 = function (selector) {
            return document.querySelectorAll(selector);
        };
        return THselector;
    })(window);

    TH.sel = TH.prototype.sel = THselector.sel;
    TH.sel5 = TH.prototype.sel5 = THselector.sel5;

    TH.prototype.extend(TH, {});

//  CSS engine
    TH.prototype.extend(TH, {
        css: function (obj, sty) {
            if (!sty) {
                for (var key in obj) {
                    this.bl(this.setStyle, [key, obj[key]]);
                }
            }
            else {
                this.bl(this.setStyle, [obj, sty])
            }
            return this;
        },
        hide: function () {
            this.bl(this.setStyle, ["display", "none"]);
            return this;
        },
        show: function () {
            this.bl(this.setStyle, ["display", "block"]);
            return this;
        },
        setStyle: function (key, value) {
            this.style[key] = value;
        },
        getStyle: function (key) {
            if (this[0].currentStyle) {
                return this[0].currentStyle[key];
            } else {
                var style = getComputedStyle(this[0], null)[key];
                return style == "auto" ? 0 : style;
            }
        },
        width: function (obj) {
            if (obj) {
                this.bl(this.setStyle, ["width", obj + "px"]);
            }
            else {
                return parseInt(this.getStyle("width"));
            }
        },
        height: function (obj) {
            if (obj) {
                this.bl(this.setStyle, ["height", obj + "px"]);
            }
            else {
                return parseInt(this.getStyle("height"));
            }
        }
    });

//  Animation engine
    //  时间进程
    function Tween(prop, dura, easeType, that) {
        return new Tween.prototype.init(prop, dura, easeType, that);
    }

    TH.Tween = Tween;

    Tween.prototype = {
        startTime: 0,
        dura: 0,
        easeType: "",
        timer: null,
        callback: null,
        isComplete: false,
        constructor: Tween,
        init: function (prop, dura, easeType, that) {
            this.dura = dura;
            this.easeType = easeType;
            this.start = {};
            this.distance = {};
            this.end = prop;
        },
        getTween: function (now) {
            //var step = {
            //    linear: function (now, start, dura) {
            //        return (now - start) / dura;
            //    }
            //};
            //return step[this.easeType](now, this.startTime, this.dura);

            //  贝塞尔方式
            var step = {
                //线性匀速
                linear:function (t, b, c, d){
                    return (c - b) * (t/ d);
                },
                //弹性运动
                easeOutBounce:function (t, b, c, d) {
                    if ((t/=d) < (1/2.75)) {
                        return c*(7.5625*t*t) + b;
                    } else if (t < (2/2.75)) {
                        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
                    } else if (t < (2.5/2.75)) {
                        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
                    } else {
                        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
                    }
                },
                //其他
                swing: function (t, b, c, d) {
                    return this.easeOutQuad(t, b, c, d);
                },
                easeInQuad: function (t, b, c, d) {
                    return c*(t/=d)*t + b;
                },
                easeOutQuad: function (t, b, c, d) {
                    return -c *(t/=d)*(t-2) + b;
                },
                easeInOutQuad: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t + b;
                    return -c/2 * ((--t)*(t-2) - 1) + b;
                },
                easeInCubic: function (t, b, c, d) {
                    return c*(t/=d)*t*t + b;
                },
                easeOutCubic: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t + 1) + b;
                },
                easeInOutCubic: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t + b;
                    return c/2*((t-=2)*t*t + 2) + b;
                },
                easeInQuart: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t + b;
                },
                easeOutQuart: function (t, b, c, d) {
                    return -c * ((t=t/d-1)*t*t*t - 1) + b;
                },
                easeInOutQuart: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
                    return -c/2 * ((t-=2)*t*t*t - 2) + b;
                },
                easeInQuint: function (t, b, c, d) {
                    return c*(t/=d)*t*t*t*t + b;
                },
                easeOutQuint: function (t, b, c, d) {
                    return c*((t=t/d-1)*t*t*t*t + 1) + b;
                },
                easeInOutQuint: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
                    return c/2*((t-=2)*t*t*t*t + 2) + b;
                },
                easeInSine: function (t, b, c, d) {
                    return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
                },
                easeOutSine: function (t, b, c, d) {
                    return c * Math.sin(t/d * (Math.PI/2)) + b;
                },
                easeInOutSine: function (t, b, c, d) {
                    return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
                },
                easeInExpo: function (t, b, c, d) {
                    return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b;
                },
                easeOutExpo: function (t, b, c, d) {
                    return (t==d) ? b+c : c * (-Math.pow(2, -10 * t/d) + 1) + b;
                },
                easeInOutExpo: function (t, b, c, d) {
                    if (t==0) return b;
                    if (t==d) return b+c;
                    if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b;
                    return c/2 * (-Math.pow(2, -10 * --t) + 2) + b;
                },
                easeInCirc: function (t, b, c, d) {
                    return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
                },
                easeOutCirc: function (t, b, c, d) {
                    return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
                },
                easeInOutCirc: function (t, b, c, d) {
                    if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
                    return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
                },
                easeInElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                },
                easeOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
                },
                easeInOutElastic: function (t, b, c, d) {
                    var s=1.70158;var p=0;var a=c;
                    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
                    if (a < Math.abs(c)) { a=c; var s=p/4; }
                    else var s = p/(2*Math.PI) * Math.asin (c/a);
                    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
                    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
                },
                easeInBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*(t/=d)*t*((s+1)*t - s) + b;
                },
                easeOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
                },
                easeInOutBack: function (t, b, c, d, s) {
                    if (s == undefined) s = 1.70158;
                    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
                    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
                },
                easeInBounce: function (t, b, c, d) {
                    return c - this.easeOutBounce (d-t, 0, c, d) + b;
                },
                easeInOutBounce: function (t, b, c, d) {
                    if (t < d/2) return this.easeInBounce (t*2, 0, c, d) * .5 + b;
                    return this.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
                }
            };

            return step[this.easeType](now - this.startTime,0,1,this.dura);
        }
    };

    Tween.prototype.init.prototype = Tween.prototype;

    TH.prototype.extend(TH, {
        //  添加动画
        animate: function (prop, dura, easeType, callback) {
            //console.log(this);
            if(!callback) {
                if(typeof easeType === "function") {
                    callback = easeType;
                    easeType = "linear";
                }
                else {
                    easeType = callback;
                    callback = function () {};
                }
            }
            if(!easeType) {
                easeType = "linear";
            }
            //  如果(不能存在)或者(动画结束且没有新动画排队)
            if(typeof this.tween == "undefined" || ((this.tween.isComplete)&&(!this.animationQueue.length))) {
                console.log("开始动画");
                this.initAnimation(new Tween(prop, dura, easeType, this),callback);
            }
            //  (存在)且(动画未结束或有新动画排队)
            else {
                console.log("排队");
                this.animationQueue[this.animationQueue.length++] = new Tween(prop, dura, easeType, this);
                this.animationQueue[this.animationQueue.length - 1].callback = callback;
            }
            return this;
        },
        //  初始化动画
        initAnimation: function (objTween,callback) {
            this.tween = objTween;
            var that = this;
            this.tween.startTime = +new Date();
            this.tween.isComplete = false;
            this.tween.callback = callback;
            for (var key in this.tween.end) {
                this.tween.start[key] = parseFloat(that.getStyle(key));
                this.tween.distance[key] = parseFloat(this.tween.end[key]) - this.tween.start[key];
            }
            //  动画定时器
            this.tween.timer = setInterval(function () {
                that.run();
            }, 16);
        },
        //  执行动画
        run: function () {
            var now = +new Date();
            var that = this;
            var tween = this.tween.getTween(now);
            if (tween < 1) {
                this.bl(function (tw) {
                    for (var key in tw.distance) {
                        key=="opacity"?
                            that.css(key, (tw.start[key] + tween * tw.distance[key])):
                            that.css(key, (tw.start[key] + tween * tw.distance[key]) + "px");
                    }
                }, [this.tween]);
            }
            else {
                this.tween.isComplete = true;
                for (var key in this.tween.distance) {
                    key=="opacity"?
                        that.css(key, (this.tween.start[key] + this.tween.distance[key])):
                        that.css(key, (this.tween.start[key] + this.tween.distance[key]) + "px");
                }
                this.stop();
            }
        },
        //  结束动画
        stop: function () {
            //  先清除本jQuery对象下tween的定时器,然后判断是自然结束还是人为提前结束
            //  若自然结束,则运行callback,若人为结束,则不运行callback.
            clearInterval(this.tween.timer);
            if (this.tween.isComplete) {
                console.log("全部结束");
                if(this.tween.callback) {
                    var that = this;
                    var thatcallback = that.tween.callback;
                    for(var i=0;i<that.length;i++) {
                        setTimeout(function(i){
                            return function () {
                                //  这里不能用下面的,因为闭包+setTimeout会有延迟,而that是一个地址,为浅拷贝.
                                //  真正运行that.tween.callback的时候,that已经在下面被队列中的动画覆盖了
                                //  而直接把函数体赋值属于深拷贝,
                                //  不是传地址,而是=号重载时判断右值类型为Function
                                //  则return new Function(右值)因此可以实现
                                //  Array对象的赋值为浅拷贝.
                                //  要注意,在JS内置对象中,Function的赋值为深拷贝.
                                thatcallback.apply(that[i]);
                                //that.tween.callback.apply(that[i]);
                                //  此处有延迟,因此要通过闭包保存函数体而非其父级指针
                            };
                        }(i),0);
                    }
                }
            }
            else {
                console.log("提前结束");
                this.tween.isComplete = true;
            }
            //  本次动画结束后,检测队列中是否有待运行动画,
            //  有则将其作为参数,初始化本对象的动画方法然后从队列中将其清除
            if(this.animationQueue.length) {
                this.initAnimation(this.animationQueue[0],this.animationQueue[0].callback);
                myShift.call(this.animationQueue);
            }
        },
        fadeIn: function (speed,type,callback) {
            var spe;
            if(speed) {
                if(typeof speed == "string") {
                    switch(speed)
                    {
                        case "slow":
                            spe = 600;break;
                        case "medium":
                            spe = 400;break;
                        case "fast":
                            spe = 200;break;
                    }
                }
            }
            else {
                spe = 400;
            }
            return this.animate({"opacity":1},spe,type?type:"linear",callback);
        },
        fadeOut: function (speed,type,callback) {
            var spe;
            if(speed) {
                if(typeof speed == "string") {
                    switch(speed)
                    {
                        case "slow":
                            spe = 600;break;
                        case "medium":
                            spe = 400;break;
                        case "fast":
                            spe = 200;break;
                    }
                }
            }
            else {
                spe = 400;
            }
            return this.animate({"opacity":0},spe,type?type:"linear",callback);
        }
    });


//  Event engine

    TH.Event = function () {
        if((this.constructor) !== TH.Event) {
            return new TH.Event();
        }
    };

    TH.prototype.extend(TH, {
        on: function (selector, type, fn) {
            if (arguments.length == 2) {
                if(document.addEventListener){
                    this.bl('addEventListener', [selector, function (event) {
                        var evt = event || window.event;
                        type.call(this, evt);
                    }]);
                }
                else if(document.attachEvent) {
                    this.bl('attachEvent', [selector, function (event) {
                        var evt = event || window.event;
                        type.call(this, evt);
                    }]);
                }
                else {
                    this.bl('on' + type, [selector, function (event) {
                        var evt = event || window.event;
                        type.call(this, evt);
                    }]);
                }
            }
            else if (arguments.length == 3) {
                if(document.addEventListener) {
                    this.bl('addEventListener', [selector, type, function (event) {
                        var evt = event || window.event;
                        if (evt.target == selector) {
                            fn.call(evt.target, evt);
                        }
                    }]);
                }
                else if(document.attachEvent) {
                    this.bl('attachEvent', [selector, type, function (event) {
                        var evt = event || window.event;
                        if (evt.target == selector) {
                            fn.call(evt.target, evt);
                        }
                    }]);
                }
                else {
                    this.bl('on' + type, [selector, function (event) {
                        var evt = event || window.event;
                        if (evt.target == selector) {
                            fn.call(evt.target, evt);
                        }
                    }]);
                }
            }
            return this;
        },
        click: function (fn) {
            this.on("click",fn);
        },
        mouseover: function (fn) {
            this.on("mouseover",fn);
        },
        mouseout: function (fn) {
            this.on("mouseout",fn);
        },
        mouseenter: function (fn) {
            this.on("mouseenter",fn);
        },
        mouseleave: function (fn) {
            this.on("mouseleave",fn);
        },
        hover: function (fn1,fn2) {
            this.on("mouseover",fn1).on("mouseout",fn2);
        }
    });

    //  属性框架
    TH.prototype.extend(TH, {
        //  添加属性以及获取属性值(无法修改属性)
        attr: function (key, value) {
            if (value) {
                this.bl("setAttribute", [key, value])
            }
            else {
                return this[0].getAttribute(key);
            }
            return this;
        },
        //  删除属性
        removeAttr: function () {
            for (var i = 0; i < arguments.length; i++) {
                this.bl("removeAttribute", [arguments[i]]);
            }
            return this;
        },
        //  添加Class
        addClass: function (value) {
            this.bl(function (_this, value) {
                if (!_this.hasClass.apply(this, [value])) {
                    var t = this.className + " " + value;
                    this.className = trimAll(t.replace("  ", " "));
                }
            }, [this, value]);
            return this;
        },
        //  删除Class
        removeClass: function (value) {
            this.bl(function (_this, value) {
                if (_this.hasClass.apply(this, [value])) {
                    this.className = trimAll(this.className.replace(value, '').replace("  ", " "));
                }
            }, [this, value]);
            return this;
        },
        //  toggleClass
        toggleClass: function (value) {
            this.bl(function (_this, value) {
                if (_this.hasClass.apply(this, [value])) {
                    this.className = trimAll(this.className.replace(value, '').replace("  ", " "));
                }
                else {
                    var t = this.className + " " + value;
                    this.className = trimAll(t.replace("  ", " "));
                }
            }, [this, value]);
            return this;
        },
        //  检测Class
        hasClass: function (value) {
            return -1 < (" " + this.className + " ").indexOf(" " + value + " ");
        },
        html: function (text) {
            if(text) {
                this.bl(function (text) {
                    this.innerHTML = text;
                },[text]);
            }
            else {
                return this[0].innerHTML;
            }
        },
        text: function (text) {
            if(text) {
                this.bl(function (text) {
                    this.innerText = text;
                },[text]);
            }
            else {
                return this[0].innerText;
            }
        },
        val: function (value) {
            if(value) {
                this.bl(function (value) {
                    this.value = value;
                },[value]);
            }
            else {
                return this[0].value;
            }
        }
    });


    TH.prototype.init.prototype = TH.prototype;


    window.TH = TH;

}(window);