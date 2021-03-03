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
 * @param {*} title 图标题
 */
const createGraph = (data, type, width, height, title) => {
    return (
        <Plot
            key={title}
            data={[{
                x: data.x,
                y: data.y,
                type: type,
            }]}
            layout={{
                width: width,
                height: height,
                title: title,
            }}
        />
    )
}
export default createGraph