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

const createSunburst = (data, type, width, height, title, x, y) => {
    console.log(data[0])
    return (
        <Plot
            key={title}
            data={data[0]}
            path={x}
            value={y}
            color={y}
            layout={{
                width: width,
                height: height,
                title: title,
            }}
        />
    )
}

function LinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const linePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500; // 高度可能根据图的大小进行更改
    React.useEffect(() => {
        if (linePictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {
                let dataArr = [];
                for (const label of state.labelColumn) {
                    let data = {}
                    data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                    data.y = state.data4Analyse.map((value) => value[label])
                    data.type = 'sunburst'
                    data.name = label
                    dataArr.push(data)
                }
                graphArr.push(createSunburst(dataArr, 'sunburst', width, height, `${state.timeColumn}(X)`, 'x', 'y'))

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
        </div>
    )
}
export default LinePicture