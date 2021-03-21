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
const compare = (a, b) => {
    if (isNaN(a) && isNaN(b)) {
        return 0
    }
    else {
        return - parseFloat(a) + parseFloat(b)
    }
}

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
        if (sunburstPictureRef.current) {
            let layout = {
                margin: { l: 0, r: 0, b: 0, t: 0 },
                width: 500,
                height: 500,
                plot_bgcolor: 'rgba(255,255,255,0)',
                paper_bgcolor: 'rgba(255,255,255,0)'
            };
            let values = [, ...unpack(state.data4Analyse, state.labelColumn)]
            const centerText = state.labelColumn
            let labels = [centerText, ...unpack(state.data4Analyse, state.timeColumn)]

            if (state.data4Analyse.length > 150) {
                values = values.sort(compare)
                values = [...values.slice(0, 75), ...values.slice(-75, -1)]
                labels = labels.slice(0, 150)
            }

            const parents = labels.map(e => {
                return e === centerText ? "" : centerText
            })



            const data = [{
                type: "sunburst",
                labels: labels,
                parents: parents,
                values: values,
                outsidetextfont: { size: 20, color: "#377eb8" },
                leaf: { opacity: 0.4 },
                marker: { line: { width: 2 } },
            }];
            setInnerGraph([createComplexGraph(data, 'Sunburst', layout)])

        }
        return () => {
            setInnerGraph([])
        }
    }, [])
    return (
        <div ref={sunburstPictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
        </div>
    )
}
export default SunburstPicture