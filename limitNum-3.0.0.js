/**
 * Created by zdh on 2016/6/29.
 * on:LHTB
 */
;
(function ($, windows, document, undefined) {
    var limitObj = function (ele, opts) {
        this.$ele = ele;
        var me = this;
        this.defaults = {
            "type": "number", //如果只英文字母 letters、int  只允许输入数字和小数点 dot  数字和英文字符 number_letters和下划线
            "regularExpression": "",
            "negative": true, //默认可以输入负数
            "first": 8, //使用normal 则不限制
            "last": 2,
            "includeZero": true,
            "max": "normal",
            "min": "normal",
            "underline": true,
            "callback": function () {}
        };
        this.options = $.extend({}, this.defaults, opts); //也可以直接判断是否为undefined
        this.val = "";
        this.init = function () {
            var opt = this.options;
            ele.unbind('input propertychange');
            ele.bind('input propertychange', function () {
                var originalValue = me.val = ele[0].value; //部分浏览器原来获取的是1会导致得到的值是111情况
                var resultVal;
                //当删除完之后就不继续执行。
                if (originalValue == "") {
                    return;
                }
                if(opt.type == "custom"){
                    if(!opt.regularExpression) return;
                    resultVal = originalValue.replace(opt.regularExpression, "");
                }
                else if (opt.type === "number") { //== 数字
                    //要保证传入的是整数型类型
                    resultVal = me.limitNum(ele, originalValue,opt);
                    //opt.callback(me.$ele);
                } else if (opt.type === "int") { //== 整数
                    resultVal = originalValue.replace(/[^0-9]/g, "");
                    //去除掉头部的0
                    resultVal = me.removeFirstZero(resultVal);
                    var max = Number(opt.max),min = Number(opt.min)
                    if (max && max !== "normal" && Number(resultVal) > max) {
                        resultVal = opt.max;
                    }
                    if (min && min !== "normal" && Number(resultVal) > min) {
                        resultVal = min;
                    }
                    //var negative = val.charAt(0);
                    //if (negative == '-' && opt.negative) {
                    //    node.val('-' + node.val());
                    //}
                } else if (opt.type === "letters") { //== 只能是英文字母
                    resultVal = originalValue.replace(/[^a-z A-Z]/g, "");
                } else if (opt.type === "number_letters") { //== 只能是数字、英文字母和下划线
                    resultVal = originalValue.replace(/[^\w]/ig, "");
                    if (!opt.underline) {
                        resultVal = resultVal.replace(/_/g, "");
                    }
                }
                if (resultVal.length > opt.first) {
                    resultVal = resultVal.substring(0, opt.first);
                }
                //判断修复不断触发onchange等事件，导致堆栈溢出状况。
                if (resultVal === originalValue) {
                    return;
                }
                ele.val(resultVal);
                me.setCaretPosition(resultVal,ele);
                opt.callback && opt.callback(ele, resultVal);
            });
            /*
             else if(opt.type == "dot"){
             ele.bind('input propertychange', function () {
             var val = ele.val().replace(/[^\d.]/,""),
             valList = val.split('.');
             ele.val(valList[0] + "." + valList[1]);
             });
             }
             */
        };
        //== 控制输入数字
        this.limitNum = function (node,vals,opt) {
            var first = opt.first,
                last = opt.last;
            var val = vals,
                resultVal = "",
                testRuler;
            //这儿反斜杠必须要转义才能行
            if (first && first !== "normal" && last !== "normal") {
                testRuler = new RegExp("^\\d{0," + first + "}(?:\\.\\d{0," + last + "})?$");
            } else if (last && last !== "normal") {
                testRuler = new RegExp("^\\d*(?:\\.\\d{0," + last + "})?$");
            } else {
                testRuler = new RegExp("^\\d*(?:\\.\\d)?$");
            }


            // 判断第一位的值
            var negative = val.charAt(0);

            function digit(val) {
                var ind = val.indexOf('.'),
                    result = "";
                if (ind === -1) {
                    var num = val;

                    //限制位数的措施
                    num = num.toString();
                    if (first && first !== "normal" && num.length > first && first !== "normal") {
                        num = num.substring(0, first);
                    }
                    result = num;

                    //去掉整型首字母的0
                    /*                    if (opt.includeZero && resultVal.length >= 1) {
                                            resultVal = resultVal.replace(/\b(0+)/gi, "");
                                            //修复两个0
                                            if (resultVal === "") {
                                                resultVal = 0;
                                            }
                                        }else{
                                            resultVal = resultVal.replace(/\b(0+)/gi, "");
                                        }*/
                    result = me.removeFirstZero(result);
                } else {
                    //限制位数的措施
                    var left = val.split('.')[0],
                        right = val.split('.')[1];
                    if ((left == "" || left == undefined || left == null) && last && last !== "normal") {
                        left = "0";
                        right = right.substring(0, last);
                    } else if ((right == "" || right == undefined || right == null) && first && first !== "normal") {
                        left = left.substring(0, first);
                        right = "";
                    } else {
                        if (first && first !== "normal") {
                            left = left.substring(0, first);
                        }
                        if (last && last !== "normal") {
                            right = right.substring(0, last);
                        }

                    }
                    result = left + "." + right;
                }
                return result;
            }

            if (!testRuler.test(val)) {
                val = val.replace(/[^\d.]/g, "");
            }
            resultVal = digit(val);
            var max = Number(opt.max);  

            // 是否允许添加负数
            if (negative === '-' && opt.negative) {
                resultVal = '-' + resultVal;
            } else if (max && max !== "normal" && Number(resultVal) > max) {
                resultVal = opt.max;
            }
            return resultVal;
            //最后结果写入
            // node.val(resultVal);
            // this.options.callback(this.$ele, val);
        };

        //== 控制完成
        this.removeFirstZero = function (val) {
            var resultVal = val;
            if (this.options.includeZero && resultVal.length >= 1) {
                resultVal = resultVal.replace(/\b(0+)/gi, "");
                //修复两个0
                if (resultVal === "") {
                    resultVal = "0";
                }
            } else {
                resultVal = resultVal.replace(/\b(0+)/gi, "");
            }
            return resultVal;
        };

        this.setCaretPosition = function (resultVal,node) {
            var lessThenIE8 = function () {
                var UA = navigator.userAgent,
                    isIE = UA.indexOf('MSIE') > -1,
                    v = isIE ? /\d+/.exec(UA.split(';')[1]) : 'no ie';
                return v <= 8;
            };
            //获取光标位置
            function getCursortPosition(ctrl) {
                var CaretPos = 0; // IE Support
                if (document.selection) {
                    ctrl.focus();
                    var Sel = document.selection.createRange();
                    Sel.moveStart('character', -ctrl.value.length);
                    CaretPos = Sel.text.length;
                }
                // Firefox support
                else if (ctrl.selectionStart || ctrl.selectionStart == '0')
                    CaretPos = ctrl.selectionStart;
                return (CaretPos);
            }

            //设置光标位置
            function setCaretPosition(ctrl, pos) {
                if (ctrl.setSelectionRange) {
                    ctrl.focus();
                    ctrl.setSelectionRange(pos, pos);
                } else if (ctrl.createTextRange) {
                    var range = ctrl.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', pos);
                    range.moveStart('character', pos);
                    range.select();
                }
            }
            var pos;
            if(resultVal === this.options.max){
                pos = resultVal.toString().length;
            }
            if (!lessThenIE8()) {
                pos = getCursortPosition(node[0]);
            } else {
                $(document).bind("contextmenu", function () {
                    return false;
                });
            }
            node.trigger('focus');
            if (!lessThenIE8() && !pos) {
                setCaretPosition(node[0], pos);
            }
        }
        //对象初始化
        this.init();
    };
    limitObj.prototype = {};
    //初始化插件
    $.fn.limit = function (options) {
        var me = this;
        return this.each(function () {
            var a = new limitObj($(this), options);
            return a; //这儿我想返回什么就返回什么
        });
    }
})(jQuery, window, document);