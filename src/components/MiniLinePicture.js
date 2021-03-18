import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import Plot from 'react-plotly.js';

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}));

const createGraph = (data, key, layout) => {
    return (
        <Plot
            key={key}
            data={data}
            layout={layout}
        />
    )
}
function MiniLinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const miniLinePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    React.useEffect(() => {
        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }
        if (miniLinePictureRef.current) {
            let data = []
            let count = 1;
            let axis = {
                showline: true,
                zeroline: false,
                showgrid: true,
                mirror: true,
                ticklen: 4,
                gridcolor: '#ffffff',
                tickfont: { size: 10 },
            }
            let layout = {
                // width: 100,
                height: 500,
                title: "Features Line Graph",
                plot_bgcolor: 'rgba(228, 222, 249, 0.65)',
                showlegend: false,
            }
            for (const column of state.inputColumn) {
                let x = unpack(state.data4Analyse, state.timeColumn)
                let y = unpack(state.data4Analyse, column)

                // console.log(count, count + 'x')
                let obj = {
                    x: x,
                    y: y,
                    xaxis: 'x' + count,
                    yaxis: 'y' + count,
                    mode: 'lines',
                    // line: { width: 2, color: '#9748a1' },
                    name: column
                }
                layout['xaxis' + count] = Object.assign({ domain: [0.5, 1], anchor: 'y' + count, showticklabels: count === 1 ? true : false }, axis)
                layout['yaxis' + count] = Object.assign({ domain: [0 + (count - 1) / state.inputColumn.length, count / state.inputColumn.length - 0.02], anchor: 'x' + count, hoverformat: '.2f' }, axis)
                data.push(obj)
                count++;
            }
            setInnerGraph([createGraph(data, 'miniline', layout)])

            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div ref={miniLinePictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
        </div>
    )
}
export default MiniLinePicture
