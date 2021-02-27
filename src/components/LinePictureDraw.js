import React from 'react'
import * as d3 from "d3";
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import './svg.css'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'float'
    },
}));

function LinePictureDraw() {
    const [state,] = useGlobalState()
    const classes = useStyles()
    const linePictureRef = React.useRef(null)
    const width = 800;
    let height = 500; // 高度可能根据图的大小进行更改
    const padding = {
        top: 50,
        right: 50,
        bottom: 50,
        left: 50,
    };
    /**
     * @param {*} svg 图
     * @param {*} data 待可视化数据
     * @param {*} x x轴标签
     * @param {*} y y轴标签
     * @param {*} yBias y轴绘图的偏置(多个图的时候使用)
     */
    const createLinePicture = (svg, data, x, y, yBias) => {
        const maxData = max(data, (d) => parseFloat(d[y]));//获取y的最大值
        const minData = min(data, (d) => parseFloat(d[y]));//获取y的最小值
        const xScale = scaleBand() // 构造x轴的比例尺
            .domain(data.map(item => item[x]))
            .range([0, width - padding.left - padding.right]);
        const yScale = scaleLinear() // 构造y轴的比例尺
            .domain([minData, maxData])
            .range([500 - padding.top - padding.bottom, 0]);

        // 根据比例尺生成坐标轴
        const xAxis = axisBottom(xScale).tickValues(xScale.domain().filter(function (d, i) {
            return !(i % 50);
        })).tickFormat(function (d) {
            return d.split("-")[0]
        }); // 每隔50个x刻度设置一段文字
        const yAxis = axisLeft(yScale).ticks(5);

        // 添加坐标轴
        svg.append('g')
            .attr('class', 'axis') // 后期添加 class为 axis对坐标轴进行美化
            .attr('transform', 'translate(' + padding.left + ',' + (500 - padding.bottom + yBias * 500) + ')')
            .call(xAxis)
            .selectAll("text")
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-65)")

        svg.append("text")
            .text(x)
            .attr("fill", "black")
            .attr("text-anchor", "end")//字体尾部对齐
            .attr("dx", "1em")//沿y轴平移一个字体的大小;
            .attr('transform', 'translate(' + (width - padding.right) + ',' + (500 - padding.bottom + yBias * 500) + ')')
            .attr("font-weight", "bold")
            .attr("font-size", "12px")

        svg.append('g')
            .attr('class', 'axis')
            .attr('transform', 'translate(' + padding.left + ',' + (padding.top + yBias * 500) + ')')
            .call(yAxis)
            .append("text")
            .text(y)
            .attr("transform", "rotate(-90)")//text旋转-90°
            .attr("fill", "black")
            .attr("text-anchor", "end")//字体尾部对齐
            .attr("dy", "1em")//沿y轴平移一个字体的大小;
            .attr("font-weight", "bold")


        // 添加经过比例尺调整的折线
        let line = d3.line()
            .x((d) => xScale(d[x]))
            .y((d) => yScale(d[y]))
            .curve(d3.curveBasis);


        svg.append("path")
            .attr('transform', 'translate(' + padding.left + ',' + (padding.top + yBias * 500) + ')')
            .attr('stroke-width', 1)
            .attr('d', line(data))
    }

    React.useEffect(() => {
        if (linePictureRef.current) {

            height = height * state.labelColumn.length
            if (state.inputColumn.length !== 0) {// 加上其他自变量为x轴的图形总的个数
                height = height + 500 * state.labelColumn.length * state.inputColumn.length
            }


            const svg = d3.select(linePictureRef.current)
                .append('svg')
                .attr('width', width + 'px')
                .attr('height', height + 50 + 'px');

            let bias = 0;

            if (state.labelColumn.length !== 0) {// 以时间为x轴的数据拆分
                let data;
                for (const label of state.labelColumn) {
                    data = state.data4Analyse.map((value) => (
                        {
                            [state.timeColumn]: value[state.timeColumn],
                            [label]: value[label]
                        }
                    ))
                    createLinePicture(svg, data, state.timeColumn, label, bias++)
                }

                if (state.inputColumn.length !== 0) {// 以其他变量为x轴的数据拆分
                    let data;
                    for (const label of state.labelColumn) {
                        for (const input of state.inputColumn) {
                            data = state.data4Analyse.map((value) => (
                                {
                                    [input]: value[input],
                                    [label]: value[label]
                                }
                            ))
                            createLinePicture(svg, data, input, label, bias++)
                        }
                    }
                }
            }
            return () => {
                svg.remove()
            }
        }
    }
    )
    return (
        <div id='lineChart' className={classes.root}
            ref={linePictureRef} >
        </div>
    )
}

export default LinePictureDraw
