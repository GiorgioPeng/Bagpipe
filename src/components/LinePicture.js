import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import ButtonGroup from '@material-ui/core/ButtonGroup';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRightSharpIcon from '@material-ui/icons/KeyboardArrowRightSharp';
import KeyboardArrowLeftSharpIcon from '@material-ui/icons/KeyboardArrowLeftSharp';
import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    wholeContainer: {
        margin: '5px auto',
        width: '800px',
        height: '600px',
        overflow: 'hidden'
    },
    graphContainer: {
        position: "relative",
        display: 'flex',
        height: '500px',
        transition: '1s all linear'
    },
    buttonContainer: {
        width: '800px',
        height: '100px',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
}));
function LinePicture() {
    const [state,] = useGlobalState()
    const classes = useStyles();
    const linePictureRef = React.useRef(null)
    const [innerGraph, setInnerGraph] = React.useState([])
    const width = 800;
    const height = 500; // 高度可能根据图的大小进行更改
    const [graphCount, setGraphCount] = React.useState(0);
    const [bias, setBias] = React.useState(0);
    const move = (direction) => {
        if (direction === 'left') {
            setBias((bias) =>
                bias + 800 <= 0 ?
                    bias + 800
                    :
                    -graphCount * 800 + 800
            )
        }
        else {
            setBias((bias) =>
                bias - 800 >= -graphCount * 800 + 800 ?
                    bias - 800
                    :
                    0
            )
        }
    }
    React.useEffect(() => { }, [bias, graphCount])
    React.useEffect(() => {
        if (linePictureRef.current) {
            const graphArr = []
            if (state.labelColumn.length !== 0) {// 以时间为x轴的数据拆分
                let data = {};
                for (const label of state.labelColumn) {
                    data.x = state.data4Analyse.map((value) => value[state.timeColumn])
                    data.y = state.data4Analyse.map((value) => value[label])
                    graphArr.push(createGraph(data, 'line', width, height, `${state.timeColumn}(X) -- ${label}(Y)`))
                    setGraphCount(e => ++e);
                }

                if (state.inputColumn.length !== 0) {// 以其他变量为x轴的数据拆分
                    let data = {};
                    for (const label of state.labelColumn) {
                        for (const input of state.inputColumn) {
                            data.x = state.data4Analyse.map((value) => value[input])
                            data.y = state.data4Analyse.map((value) => value[label])
                            graphArr.push(createGraph(data, 'scatter', width, height, `${input}(X) -- ${label}(Y)`))
                            setGraphCount(e => ++e);
                        }
                    }
                }
                setInnerGraph(graphArr)
            }
            return () => {
                setInnerGraph([])
            }
        }
    }, [])
    return (
        <div className={classes.wholeContainer}>
            <div ref={linePictureRef} className={classes.graphContainer} style={{ left: bias }}>
                {innerGraph?.map(e => e)}
            </div>
            <div className={classes.buttonContainer}>
                <ButtonGroup variant="contained" color="primary">
                    <IconButton onClick={() => move('left')} >
                        <KeyboardArrowLeftSharpIcon fontSize="large" />
                    </IconButton>
                    <IconButton onClick={() => move('right')} >
                        <KeyboardArrowRightSharpIcon fontSize="large" />
                    </IconButton>
                </ButtonGroup>
            </div>
        </div>
    )
}
export default LinePicture