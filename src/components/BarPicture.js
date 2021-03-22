import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import createGraph from '../utils/createGraph'
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        maxWidth:'90vw',
        overflowX:'scroll',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));

function BarPicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const barPictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500;
    React.useEffect(() => {
        if (barPictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {
                let dataArr = [];
                let yLabel = '';
                if (state.inputColumn.length !== 0) {
                    for (const input of state.inputColumn) {
                        let data = {}
                        data.y = state.data4Analyse.map((value) => value[input])
                        data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                        data.type = 'bar'
                        data.name = input
                        dataArr.push(data)
                    }
                }
                else{
                    yLabel = state.labelColumn[0]
                }

                let output = {}
                output.x = state.data4Analyse.map((value) => value[state.timeColumn])
                output.y = state.data4Analyse.map((value) => value[state.labelColumn])
                output.type = 'bar'
                output.name = state.labelColumn[0]
                dataArr.push(output)
                graphArr.push(createGraph(dataArr, 'bar', width, height, state.timeColumn, yLabel))
                setInnerGraph(graphArr)
            }
            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div ref={barPictureRef} className={classes.graphContainer}>
            {innerGraph?.map(e => e)}
            <Tooltip
                TransitionComponent={Fade}
                TransitionProps={{ timeout: 600 }}
                title={'You can zoom and drag this graph to know the difference between different columns!'}>
                <HelpIcon fontSize='small' />
            </Tooltip>
        </div>
    )
}
export default BarPicture