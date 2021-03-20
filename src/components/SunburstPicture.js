import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import { createComplexGraph } from '../utils/createGraph'
const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}));


function SunburstPicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const sunburstPictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
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
                height: 500,
                plot_bgcolor:'rgba(255,255,255,0)',
                paper_bgcolor:'rgba(255,255,255,0)'
            };

            setInnerGraph([createComplexGraph(data, 'Sunburst', layout)])
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