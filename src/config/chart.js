import {
    lineColor
} from './theme.js'
// 饼图和列表
export function getPieChart(blockList = [], seriesDataList = [], centerText, total, unit = '个') {
    return {
        blockList,
        option: {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            series: [{
                name: '数据类型',
                type: 'pie',
                radius: ['45%', '65%'],
                center: ['50%', '45%'],
                label: {
                    show: true,
                    position: 'center',
                    formatter: [`{name|${centerText}}`, `{all|${total}${unit}}`].join('\n'),
                    textStyle: {
                        rich: {
                            name: {
                                fontSize: '12',
                                color: 'rgba(255,255,255,.8)',
                                lineHeight: 24
                            },
                            all: {
                                fontSize: '18',
                                color: '#fff',
                                lineHeight: 24
                            }
                        }
                    }
                },
                labelLine: {
                    show: false
                },
                data: seriesDataList
            }]
        }
    }
}

// 实心饼图和列表
export function getSolidPieChart(blockList = [], seriesDataList = []) {
    return {
        blockList,
        option: {
            tooltip: {
                trigger: 'item',
                formatter: '{b}: {c} ({d}%)'
            },
            series: [{
                name: '数据类型',
                type: 'pie',
                radius: '55%',
                center: ['50%', '50%'],
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                data: seriesDataList
            }]
        }
    }
}

// 渐变蓝环
export function getCirclePieChart(data, centerText) {
    return {
        backgroundColor: 'transparent',
        series: [{
            type: 'pie',
            radius: ['56%', '70%'],
            center: ['50%', '50%'],
            itemStyle: {
                normal: {
                    // eslint-disable-next-line
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                                offset: 0,
                                color: '#75EDFF'
                            },
                            {
                                offset: 1,
                                color: '#2A9CFF'
                            }
                        ]
                    )
                }
            },
            label: {
                show: true,
                position: 'center',
                formatter: [`{name|${centerText}}`].join('\n'),
                textStyle: {
                    rich: {
                        name: {
                            fontSize: '16',
                            color: '#fff',
                            lineHeight: 24
                        },
                        all: {
                            fontSize: '18',
                            color: '#fff',
                            lineHeight: 24
                        }
                    }
                }
            },
            labelLine: {
                show: false
            },
            data
        }]
    }
}

// 堆叠折线图(带图例)
/*
  data(折线图数据名称数组):[{
    name: xxx,
    value: ['xxx','xxx']
  }]
  xAxisData(折线图x轴单位数组)
  yAxisName(折线图y轴数据单位)
*/
export function getStackedLineChart(data = [], xAxisData = [], yAxisName, colorList) {
    const lineColorList = colorList || lineColor
    const obj = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [],
            right: 0,
            itemHeight: 2,
            itemWidth: 22,
            icon: 'roundRect',
            textStyle: {
                color: 'rgba(255,255,255,.5)',
                fontSize: '12px'
            }
        },
        grid: {
            top: '16%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                interval: 4,
                margin: 15
            },
            data: []
        },
        yAxis: {
            name: '',
            type: 'value',
            splitNumber: 4
        },
        series: []
    }
    const legendName = []
    const newSeries = []
    data.forEach((item, i) => {
        legendName.push(item.name)
        newSeries.push({
            name: item.name,
            type: 'line',
            data: item.value,
            symbol: 'none',
            color: lineColorList[i].color,
            areaStyle: {
                normal: {
                    color: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: lineColorList[i].dark
                        }, {
                            offset: 1,
                            color: lineColorList[i].light
                        }],
                        globalCoord: false
                    }
                }
            }
        })
    })
    obj.legend.data = legendName
    obj.series = newSeries
    obj.xAxis.data = xAxisData
    obj.yAxis.name = `(${yAxisName})`
    return obj
}

// 单折线图
/**
 * Data(折线图名称及数据): {
 *  name: xxx,
 *  value: ['xxx','xxx',...]
 * }
 * xAxisData(折线图x轴单位数组)
 * xAxisInterval(x轴单位间隔)
 * yAxisName(折线图y轴数据单位)
 * lineColor(折线图折线渐变色): {
 *  color: xxx,
 *  dark: xxx,
 *  light: xxx
 * }
 */ // 传参更改为解构赋值 便于拓展和维护
export function getSingleStackedLineChart({
    Data = {},
    xAxisData = [],
    xAxisInterval = 0,
    yAxisName,
    xAxisLineShow = true,
    xRotate = 0,
    color
}) {
    const lcColor = color || lineColor[0]
    return {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '19%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLine: {
                show: xAxisLineShow
            },
            axisLabel: {
                margin: 15,
                interval: xAxisInterval,
                rotate: xRotate
            },
            data: xAxisData
        },
        yAxis: {
            name: yAxisName ? `(${yAxisName})` : "",
            type: 'value',
            splitNumber: 4
        },
        series: {
            name: Data.name,
            type: 'line',
            data: Data.value,
            symbol: 'none',
            color: lcColor.color,
            areaStyle: {
                normal: {
                    color: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: lcColor.dark
                        }, {
                            offset: 1,
                            color: lcColor.light
                        }],
                        globalCoord: false
                    }
                }
            }
        }
    }
}


export function getSingleStackedLine(Data = {}, xAxisData = [], xAxisInterval, yAxisName, color, size) {
    const lcColor = color || lineColor[0]
    return {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            top: '19%',
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            axisLabel: {
                margin: 15,
                interval: xAxisInterval
            },
            data: xAxisData
        },
        yAxis: {
            name: yAxisName ? `(${yAxisName})` : "",
            type: 'value',
            min: size.min || 0,
            max: size.max || 1000,
            splitNumber: size.split || 5
        },
        series: {
            name: Data.name,
            type: 'line',
            data: Data.value,
            symbol: 'none',
            color: lcColor.color,
            areaStyle: {
                normal: {
                    color: {
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,
                            color: lcColor.dark
                        }, {
                            offset: 1,
                            color: lcColor.light
                        }],
                        globalCoord: false
                    }
                }
            }
        }
    }
}
// 柱状图
export function getBarGraph(Data = [], xAxisData = [], yAxisName) {
    return {
        grid: {
            x: 10,
            y: 30,
            x2: 30,
            y2: 5
        },
        xAxis: {
            type: 'category',
            // show :false,
            data: xAxisData,
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,.8)'
                }
            },
            axisTick: {
                show: false
            },
            axisLabel: {
                margin: 15
            }
        },
        yAxis: {
            name: yAxisName,

            type: 'value',
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,.8)'
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dotted',
                    color: 'rgba(255,255,255)'
                }
            },
            axisTick: {
                show: false
            }
        },
        tooltip: {},
        series: {
            // name: '共享需求',
            data: Data,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        [{
                                offset: 0,
                                color: '#2A9CFF'
                            },
                            {
                                offset: 1,
                                color: '#2A9CFF'
                            }
                        ]
                    )
                }
            },
            type: 'bar',
            showBackground: false,
            barWidth: 15,
            backgroundStyle: {
                color: 'rgba(220, 220, 220, 0.8)'
            }
        }
    }
}
// 多个柱状图

export function moreBar(legend, xData, list = [], unit) {
    let arr = []
    list.forEach((item, index) => {
        arr.push({
            name: legend[index],
            type: 'bar',
            barWidth: 6,
            barGap: '80%',
            /*多个并排柱子设置 柱子之间的间距*/
            barCategoryGap: '50%',
            // label: labelOption,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        item.color
                    )
                }
            },
            data: item.data //[320, 332, 301, 334, 390]
        })
    })
    return {
        tooltip: {

        },
        legend: {
            right: 0,
            textStyle: {
                color: "rgba(255, 255, 255, 0.8)",
            },
            data: legend //['Forest', 'Steppe']
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,.8)'
                }
            },
            axisLabel: {
                margin: 15
            },
            data: xData //['2012', '2013', '2014', '2015', '2016']
        }],
        yAxis: [{
            name: unit,
            type: 'value'
        }],
        series: arr
    };
}
// 堆叠bar
export function ddBar(legend, xData, list = [], unit) {
    let arr = []
    console.log(legend, xData, list, unit)

    list.forEach((item, index) => {
        arr.push({
            name: legend[index],
            type: 'bar',
            barWidth: 20,
            stack: item.stack,
            emphasis: {
                focus: 'series'
            },
            // label: labelOption,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line
                    color: item.color
                }
            },
            data: item.data //[320, 332, 301, 334, 390]
        })
    })
    return {
        tooltip: {
            trigger: 'axis',
            axisPointer: { // 坐标轴指示器，坐标轴触发有效
                type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
            },
            backgroundColor: "rgba(3, 51, 104,.7)",
            textStyle: {
                color: 'rgba(255,255,255,0.8)'
            }
        },
        legend: {
            left: 40,
            bottom: 0,
            textStyle: {
                color: "rgba(255, 255, 255, 0.8)",
            },
            padding: [20, 0, 0, 0],
            data: legend //['Forest', 'Steppe']
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,.8)'
                }
            },
            axisLabel: {
                margin: 15
            },
            data: xData //['2012', '2013', '2014', '2015', '2016']
        }],
        yAxis: [{
            name: unit,
            type: 'value'
        }],
        series: arr
    };
}
//堆叠折线图
export function getZx(legend, xData, list = [], unit, color) {
    let arr = []
    list.forEach((item, index) => {
        arr.push({
            name: legend[index],
            type: 'line',
            stack: '总量',
            areaStyle: {},
            emphasis: {
                focus: 'series'
            },
            lineStyle: {
                color: color[index].color,
                width: 1,
            },
            itemStyle: {
                opacity: 0,
            },
            areaStyle: {
                color: {
                    type: "linear",
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                            offset: 0,
                            color: color[index].lcolor[0], // 0% 处的颜色
                        },
                        {
                            offset: 1,
                            color: color[index].lcolor[1], // 100% 处的颜色
                        },
                    ],
                    global: false, // 缺省为 false
                },
            },
            data: item //[320, 332, 301, 334, 390]
        })
    })
    console.log(arr, '------')
    return {
        // tooltip: {
        //     trigger: 'axis',
        //     axisPointer: {
        //         type: 'cross',
        //         label: {
        //             backgroundColor: '#6a7985'
        //         }
        //     }
        //   },
        color: ['rgba(42,156,255,1)', 'rgba(39,232,158,1)', 'rgba(248,200,34,1)'],
        legend: {
            right: 0,
            top: 0,
            icon: "rect",
            textStyle: {
                fontSize: 12,
                color: "#fff",
            },
            itemHeight: 2,
            itemGap: 30,
            data: legend //['Forest', 'Steppe']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: "category",
            boundaryGap: false,
            axisTick: {
                show: false,
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: "rgba(255, 255, 255, 0.8)",
                    width: 2
                }

            },
            axisLabel: {
                color: "rgba(255, 255, 255, 0.8)",
                fontSize: "12",
                interval: 0,
            },
            interval: 0,
            data: xData //['2012', '2013', '2014', '2015', '2016']
        }],
        yAxis: [{
            name: unit,
            type: 'value'
        }],
        series: arr
    };
}

// 多个柱状图-宽度大

export function moreBar1(legend, xData, list = [], unit) {
    let arr = []
    list.forEach((item, index) => {
        arr.push({
            name: legend[index],
            type: 'bar',
            barWidth: 10,
            barGap: '20%',
            /*多个并排柱子设置 柱子之间的间距*/
            barCategoryGap: '20%',
            // label: labelOption,
            itemStyle: {
                normal: {
                    // eslint-disable-next-line
                    color: new echarts.graphic.LinearGradient(
                        0, 0, 0, 1,
                        item.color
                    )
                }
            },
            data: item.data //[320, 332, 301, 334, 390]
        })
    })
    return {
        tooltip: {

        },
        legend: {
            right: 0,
            textStyle: {
                color: "rgba(255, 255, 255, 0.8)",
            },
            data: legend //['Forest', 'Steppe']
        },
        xAxis: [{
            type: 'category',
            axisTick: {
                show: false
            },
            axisLine: {
                show: false,
                lineStyle: {
                    color: 'rgba(255,255,255,.8)'
                }
            },
            axisLabel: {
                margin: 15
            },
            data: xData //['2012', '2013', '2014', '2015', '2016']
        }],
        yAxis: [{
            name: unit,
            type: 'value'
        }],
        series: arr
    };
}