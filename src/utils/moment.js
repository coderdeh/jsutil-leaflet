import moment from 'moment'
moment.suppressDeprecationWarnings = true;
const getTime = function () {
    const getToday = moment().format('YYYY/MM/DD') + '12:00'
    const startTime = moment(new Date(getToday)).format('YYYY/MM/DD HH:mm');
    const endTime = moment().format('YYYY/MM/DD HH:mm');
    const num = moment(startTime).diff(moment(endTime), "minutes");
    const yesterday = moment().subtract(1, 'days').format('YYYY/MM/DD') + '12:00';
    console.log(startTime, endTime)
    return num > 0 ? yesterday : startTime
}
const getSixMonth = function () {
    let ary = [6, 5, 4, 3, 2, 1]
    let times = []
    ary.forEach((item, index) => {
        let data = Number(moment(new Date()).subtract(item, 'months').startOf('month').format('MM')) + '月'
        times.push(data)
    })
    return times
}
const getSomeDay = function (n, format) {
    let times = []
    for (let i = 1; i <= n; i++) {
        let data = moment().subtract(i, "days").format(format)
        times.unshift(data)
    }
    let timesNow = []
    times.forEach((item, index) => {
        let ary = item.split('/')
        timesNow.push(Number(ary[0]) + '/' + Number(ary[1]))
    })
    return timesNow
}
const getTimeInfo = function (val, info = 'YYYY/MM/DD HH:mm:ss', type = "days", flag = true) {
    let arr = new Array();
    let len = val;
    for (let index = 1; index <= len; index++) {
        arr.push(moment().subtract(index, type).format(info))
    }
    if (flag) {
        arr.reverse()
    }
    return arr
}
export {
    getTimeInfo,
    getSixMonth,
    moment,
    getTime,
    getSomeDay
}