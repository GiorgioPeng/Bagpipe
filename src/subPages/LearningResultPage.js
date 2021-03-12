import React from 'react'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { makePredictions, predictionsOfNow } from '../utils/machineLearn'
import createGraph from '../utils/createGraph'
import DoneOutlineIcon from '@material-ui/icons/DoneOutline';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    card:{
        marginTop:'10px',
        height:'50px',
        display:'flex',
        backgroundColor:"skyblue",
        alignContent:'center',
        justifyContent:'center'
    }
}));

function LearningResultPage() {
    const [state,] = useGlobalState()
    const classes = useStyles()
    const [newData, setNewData] = React.useState(null)
    const [nextDayData, setNextDayData] = React.useState(null)
    React.useEffect(() => {
        if (state.model) {
            const column = state.labelColumn
            const data = state.data4Analyse.map(value => parseFloat(value[column]))
            let max = Math.max(...data)
            let min = Math.min(...data)
            let tempData = []
            let prefix = [] // 补全预测偏移量
            for (let index = 0; index < state.windowSize / 2; index++) {
                prefix.push(NaN)
            }
            tempData.push({
                x: state.data4Analyse.map((value) => value[state.timeColumn]),
                y: data,
                type: 'line',
                name: 'Origin Data'
            })
            tempData.push({
                x: (state.data4Analyse.map((value) => value[state.timeColumn])),
                y: prefix.concat(predictionsOfNow(data, state.model, state.windowSize).map(e => e * (max - min) + min).slice(0, -1)),
                type: 'line',
                name: 'Predict by this Model'
            })
            setNewData(tempData)
            setNextDayData(makePredictions(data, state.model, state.windowSize, state.trainingDataSize).map(e => e * (max - min) + min))
            // setTimeout(()=>{
            //     alert(`to`)
            // },0)
        }
    }, [state.model])
    return (
        <div className={classes.graphContainer}>
            {newData ? createGraph(newData, 'line', 800, 500, state.timeColumn, state.labelColumn[0]) : ''}
            {nextDayData ?
                <Card className={classes.card}>
                    <CardContent>
                        {`In the next day, ${state.labelColumn[0]} will be ${nextDayData[0]}`}
                    </CardContent>
                </Card>
                :
                ''
            }

        </div>
    )
}

export default LearningResultPage
