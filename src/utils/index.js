/* eslint-disable */
export function scaling(w, h, sw, sh) {
    var containerRatio = sw / sh;
    var imgRatio = w / h;
    var top = 0;
    var left = 0;
    var s = 1;
    if (imgRatio > containerRatio) {
        s = sw / w;
        w = sw;
        h = sw / imgRatio;
        top = sh - h;
    } else if (imgRatio < containerRatio) {
        s = sh / h;
        h = sh;
        w = sh * imgRatio;
        left = sw - w;
    } else {
        s = sw / w;
        w = sw;
        h = sh;
    }

    return {
        width: w,
        height: h,
        scale: s,
        top,
        left
    };
}
export function getClientWidth() {
    var clientWidth = 0;
    if (document.body.clientWidth && document.documentElement.clientWidth) {
        var clientWidth =
            document.body.clientWidth < document.documentElement.clientWidth ?
            document.body.clientWidth :
            document.documentElement.clientWidth;
    } else {
        var clientWidth =
            document.body.clientWidth > document.documentElement.clientWidth ?
            document.body.clientWidth :
            document.documentElement.clientWidth;
    }
    return clientWidth;
}

export function getClientHeight() {
    var clientHeight = 0;
    if (document.body.clientHeight && document.documentElement.clientHeight) {
        var clientHeight =
            document.body.clientHeight < document.documentElement.clientHeight ?
            document.body.clientHeight :
            document.documentElement.clientHeight;
    } else {
        var clientHeight =
            document.body.clientHeight > document.documentElement.clientHeight ?
            document.body.clientHeight :
            document.documentElement.clientHeight;
    }
    return clientHeight;
}

export function setFontSize() {
    var html = document.getElementsByTagName("html")[0]
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth
    html.style.fontSize = oWidth / 1920 * 64 + "px"
}
export function getUnit(num,flag = 0){
    const units = ['条','万条','亿条','万亿条'];
    if(String(parseInt(num)).length<5) {
        return {
            num:num,
            unit: units[flag]
        }
    }
    else {
        return getUnit((num/10000).toFixed(2),flag++)
    }
}
const oWidth = document.body.clientWidth || document.documentElement.clientWidth
const width = process.env.VUE_APP_WIDTH || 1920
export function getNumberByRatio(num) {
    return Math.floor(Number(num) * (oWidth / width))
}

export function getZoomByRatio(zoom) {
    // 要针对分辨率处理
    return Math.floor(Number(zoom) + (oWidth / width) - 1)
}
export function deepClone(data) {
    return JSON.parse(JSON.stringify(data));
}

export function formatDate(data, fmt) {
    let _data = null
    if (data instanceof Date) {
        _data = data
    } else {
        _data = new Date(data)
    }
    var o = {
        "M+": _data.getMonth() + 1, //月份
        "d+": _data.getDate(), //日
        "h+": _data.getHours(), //小时
        "m+": _data.getMinutes(), //分
        "s+": _data.getSeconds(), //秒
        "q+": Math.floor((_data.getMonth() + 3) / 3), //季度
        "S": _data.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (_data.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}