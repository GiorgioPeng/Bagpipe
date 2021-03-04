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
            // if (state.labelColumn.length !== 0) {
            //     if (state.inputColumn.length !== 0) {// 以其他变量为x轴的数据拆分
            //         let dataArr = [];
            //         let data = {}
            //         data.x = state.data4Analyse.map((value) => value[input])
            //         data.y = state.data4Analyse.map((value) => value[label])
            //         data.type = 'heatmap'
            //         data.name = label
            //         dataArr.push(data)
            //         graphArr.push(createGraph(dataArr, 'heatmap', width, height, `${state.inputColumn[count]}(X)`))
            //         count++;
            //     }
            // }
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