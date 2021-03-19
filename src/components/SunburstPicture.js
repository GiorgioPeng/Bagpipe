import React from 'react'
import Plot from 'react-plotly.js';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'

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

function SunburstPicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const sunburstPictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500; // 高度可能根据图的大小进行更改
    React.useEffect(() => {

        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }
        if (sunburstPictureRef.current && state.data4Analyse.length < 600) {
            const centerText = state.labelColumn
            const labels = [centerText, ...unpack(state.data4Analyse, state.timeColumn)]
            const parents = labels.map(e => {
                return e === centerText ? "" : centerText
            })
            const values = [, ...unpack(state.data4Analyse, state.labelColumn)]
            // console.log(labels, parents, values)
            const data = [{
                type: "sunburst",
                labels: labels,
                parents: parents,
                values: values,
                outsidetextfont: { size: 20, color: "#377eb8" },
                leaf: { opacity: 0.4 },
                marker: { line: { width: 2 } },
            }];

            let layout = {
                margin: { l: 0, r: 0, b: 0, t: 0 },
                width: 500,
                height: 500
            };

            setInnerGraph([createGraph(data, 'Sunburst', layout)])
        }
        return () => {
            setInnerGraph([])
        }
    }, [])
    return (
        <>
            {
                state.data4Analyse.length < 600 ?
                    <div ref={sunburstPictureRef} className={classes.graphContainer}>
                        {innerGraph?.map(e => e)}
                    </div>
                    :
                    ''
            }
        </>
    )
}
export default SunburstPicture