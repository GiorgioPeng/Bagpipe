import React from 'react'
import * as d3 from "d3";
import { max, min } from 'd3-array';
import { scaleLinear, scaleBand } from 'd3-scale';
import { axisBottom, axisLeft } from 'd3-axis';
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'float'
    },
    svg: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& path': {
            fill: 'transparent',
            stroke: 'green'
        }
    }
}));

function LinePictureDraw() {
    const [state,] = useGlobalState()
    const classes = useStyles()
    const linePictureRef = React.useRef(null)
    React.useEffect(() => {
        if (state.timeColumn && state.labelColumn && linePictureRef.current) {
            const width = 800;
            const height = 400;
            const padding = {
                top: 50,
                right: 50,
                bottom: 50,
                left: 50,
            };
            const svg = d3.select(linePictureRef.current);
            const data = state.data4Analyse.map((value) => (
                {
                    [state.timeColumn]: value[state.timeColumn],
                    [state.labelColumn]: value[state.labelColumn]
                }
            ))
            const maxData = max(data, (d) => parseFloat(d[state.labelColumn]));//获取y的最大值
            const minData = min(data, (d) => parseFloat(d[state.labelColumn]));//获取y的最小值
            console.log(state.labelColumn)
            console.log(maxData)
            const xScale = scaleBand() // 构造x轴的比例尺
                .domain(data.map(item => item[state.timeColumn]))
                .range([0, width - padding.left - padding.right]);
            const yScale = scaleLinear() // 构造y轴的比例尺
                .domain([minData, maxData])
                .range([height - padding.top - padding.bottom, 0]);

            // 根据比例尺生成坐标轴
            const xAxis = axisBottom(xScale).tickValues(xScale.domain().filter(function (d, i) {
                return !(i % 50);
            })).tickFormat(function (d) {
                return d.split("-")[0]
            }); // 每隔50个x刻度设置一段文字
            const yAxis = axisLeft(yScale).ticks(5);

            // 添加坐标轴
            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + padding.left + ',' + (height - padding.bottom) + ')')
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-.8em")
                .attr("dy", ".15em")
                .attr("transform", "rotate(-65)");

            svg.append('g')
                .attr('class', 'axis')
                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
                .call(yAxis);


            // 添加经过比例尺调整的折线
            let line = d3.line()
                .x((d) => xScale(d[state.timeColumn]))
                .y((d) => yScale(d[state.labelColumn]))
                .curve(d3.curveBasis);

            svg.append("path")
                .attr('transform', 'translate(' + padding.left + ',' + padding.top + ')')
                .attr('stroke-width', 1)
                .attr('d', line(data))
            console.log(data)
        }
    }
    )
    return (
        <div className={classes.root}>
            <svg
                className={classes.svg}
                width={800}
                height={500}
                ref={linePictureRef} />
        </div>
    )
}

export default LinePictureDraw
