import React from 'react'
import Plot from 'react-plotly.js';

/**
 * create some simple graph like the line, bar graph
 * @param {Array} data a data object array, include x and y attributes
 * @param {String} type the type of the graph like bar, scatter...
 * @param {Number} width the width of the graph
 * @param {Number} height the height of the graph
 * @param {String} xaxis the label of x axis
 * @param {String} yaxis the label of y axis
 * @return {HTMLelement} the HTML element of the graph
 */
const createGraph = (data, type, width, height, xaxis, yaxis) => {
    return (
        <Plot
            key={yaxis + xaxis + type}
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

/**
 * create some complex graph
 * @param {Array} data the data of the graph
 * @param {String} key the key of the graph
 * @param {Object} layout the layout of the graph
 * @returns {HTMLelement} the HTML element of the graph
 */
export const createComplexGraph = (data, key, layout) => {
    return (
        <Plot
            key={key}
            data={data}
            layout={layout}
        />
    )
}