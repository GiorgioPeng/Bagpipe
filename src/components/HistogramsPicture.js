import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
}));
function HistogramsPicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const histogramsPictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500; 
    React.useEffect(() => {
        if (histogramsPictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {
                if (state.inputColumn.length !== 0) {
                    let dataArr = [];
                    let yLabel = '';
                    for (const input of state.inputColumn) {
                        let data = {}
                        data.y = state.data4Analyse.map((value) => value[input])
                        data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                        data.type = 'histogram2d'
                        data.name = input
                        dataArr.push(data)
                    }
                    graphArr.push(createGraph(dataArr, 'histogram2d', width, height, state.timeColumn, yLabel))
                }
                setInnerGraph(graphArr)
            }
            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div ref={histogramsPictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
        </div>
    )
}
export default HistogramsPicture