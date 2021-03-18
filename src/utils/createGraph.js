import React from 'react'
import Plot from 'react-plotly.js';

/**
 * 
 * @param {*} data 一个对象, 包含x,y两个属性
 * @param {*} type 图像类型,比如 scatter, bar, line, pie 等
 * @param {*} mode 图像模式, 比如 line+markers
 * @param {*} marker 标记的样式
 * @param {*} width 图像宽度
 * @param {*} height 图像高度
 * @param {*} xaxis x轴标签
 * @param {*} yaxis y轴标签
 */
const createGraph = (data, type, width, height, xaxis, yaxis) => {
    return (
        <Plot
            key={xaxis+type}
            data={data}
            layout={{
                // width: width,
                height: height,
                xaxis: {
                    title: {
                        text: xaxis,
                        font: {
                            family: 'Courier New, monospace',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    },
                },
                yaxis: {
                    title: {
                        text: yaxis,
                        font: {
                            family: 'Courier New, monospace',
                            size: 18,
                            color: '#7f7f7f'
                        }
                    }
                }
            }}
        />
    )
}
export default createGraph