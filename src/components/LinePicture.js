import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import MiniLinePicture from './MiniLinePicture'
import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        maxWidth: '90vw',
        overflowX: 'scroll',
        // marginTop: '10px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
function LinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const linePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 400;
    const height = 500; 
    React.useEffect(() => {
        if (linePictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {
                let dataArr = [];
                let yLabel = ''
                for (const label of state.labelColumn) {
                    let data = {}
                    data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                    data.y = state.data4Analyse.map((value) => value[label])
                    data.type = 'line'
                    data.name = label
                    yLabel.length === 0 ? yLabel += label : yLabel += ', ' + label
                    dataArr.push(data)
                }
                graphArr.push(createGraph(dataArr, 'line', width, height, state.timeColumn, yLabel))
                setInnerGraph(graphArr)
            }
            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div ref={linePictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
            {state.inputColumn.length !== 0 ? <MiniLinePicture /> : ''}
        </div>
    )
}
export default LinePicture