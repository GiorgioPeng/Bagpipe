import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import createGraph from '../utils/createGraph'
import HelpIcon from '@material-ui/icons/Help';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
}));
function ParallelCoordinatesPicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const parallelCoordinatesPictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500;
    React.useEffect(() => {
        function unpack(rows, key) {
            return rows.map(function (row) {
                return row[key];
            });
        }
        if (parallelCoordinatesPictureRef.current) {
            let data = [{
                type: 'parcoords',
                line: {
                    showscale: true,
                    reversescale: true,
                    colorscale: 'Jet',
                    cmin: -4000,
                    cmax: -100,
                },

                dimensions: []
            }];
            let count = 0;
            for (const column of state.inputColumn) {
                let value = unpack(state.data4Analyse, column)
                let obj
                if (count === 0) {
                    obj = {
                        constraintrange: [Math.min(...value), (Math.max(...value) - Math.min(...value)) / 2],
                        range: [Math.min(...value), Math.max(...value)],
                        label: column,
                        values: unpack(state.data4Analyse, column)
                    }
                    count++;
                } else {
                    obj = {
                        range: [Math.min(...value), Math.max(...value)],
                        label: column,
                        values: unpack(state.data4Analyse, column)
                    }
                }
                data[0].dimensions.push(obj)
            }
            setInnerGraph([createGraph(data, 'parcoords', width, height, "", '')])

            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <>
            {state.inputColumn.length > 1 ?
                <div ref={parallelCoordinatesPictureRef} className={classes.graphContainer}>
                    {innerGraph?.map(e => e)}
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={'The graph focus on the relationship between the each feature. You can try to add, move and remove purple bar(s) to get more details.'}>
                        <HelpIcon fontSize='small' />
                    </Tooltip>
                </div>
                :
                ''
            }
        </>
    )
}
export default ParallelCoordinatesPicture