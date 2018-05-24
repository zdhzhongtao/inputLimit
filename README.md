# inputLimit

本项目是主要用于网页端输入框输入内容的控制，其中包括一个简单的示例。

开发者可以通过简单的配置达到对页面上的输入框做到实时的控制，完成对用户输入内容的前期保证。

## 插件实现原理


通过对节点的数字改变触发事件，获取到当前的value值，比对和裁减之后，和原来的值比对如果相同就不重新赋值，如果不想通就重新赋值，如果当前浏览器不是ie8一下，就可以直接对光标的位置进行调整之后在实现输入框的光标focus。

注：如果input是number就无法实现取值等其他信息的内容

## 插件的使用


```js
    $('.input').limit({
        "type": "number", //只英文字母letters、只允许输入整数数字int、数字和英文字符number_letters、只能是数字number(可以有小数点)
        "negative": false, //默认可以输入负数
        "first": 8, //使用normal 则不限制 小数点前面保留几位小数
        "last": 2, //== 小数点后面保留几位小数
        "includeZero": true, //== 是否包括0
        "max": "100", //== 在数字输入中的最大值
        "min": "6", //== 在数字输入中的最小值
        "underline": true, //== 是否包括下划线
        callback: function($ele,val){ //== 完成后的回调
            //console.log("当前节点"+ $ele + "当前输入框值" + val);
        }
    });
```
## 有问题请联系我
imsubred@gmail.com
