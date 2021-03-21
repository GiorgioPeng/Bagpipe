import React from 'react'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { predictionsOfNow } from '../utils/machineLearn'
import createGraph from '../utils/createGraph'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';


const useStyles = makeStyles((theme) => ({
    graphContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    card: {
        marginTop: '10px',
        height: '50px',
        display: 'flex',
        backgroundColor: "skyblue",
        alignContent: 'center',
        justifyContent: 'center'
    }
}));

function LearningResultPage() {
    const [state,] = useGlobalState()
    const classes = useStyles()
    const [newData, setNewData] = React.useState(null)
    const [nextDayData, setNextDayData] = React.useState(null)
    React.useEffect(() => {
        if (state.model !== '') {
            if (state.inputColumn.length === 0) {
                const column = state.labelColumn
                const data = state.data4Analyse.map(value => parseFloat(value[column]))
                let max = Math.max(...data)
                let min = Math.min(...data)
                let tempData = []
                let prefix = []
                let suffix = []
                for (let index = 0; index < state.windowSize + 1; index++) {
                    prefix.push(NaN)
                }
                const modelPredictData = prefix.concat(predictionsOfNow(data, state.model, state.windowSize).map(e => e * (max - min) + min))
                const divide = Math.floor(modelPredictData.length * state.trainingDataSize / 100)
                for (let index = divide; index < state.data4Analyse.length; index++) {
                    suffix.push(NaN)
                }
                let prefix2 = []
                for (let index = 0; index < divide; index++) {
                    prefix2.push(NaN)
                }

                tempData.push({
                    x: state.data4Analyse.map((value) => value[state.timeColumn]),
                    y: data,
                    type: 'line',
                    name: 'Origin Data'
                })
                tempData.push({
                    x: (state.data4Analyse.map((value) => value[state.timeColumn])),
                    y: modelPredictData.slice(0, divide).concat(suffix),
                    type: 'line',
                    name: 'Given by this Model'
                })
                tempData.push({
                    x: (state.data4Analyse.map((value) => value[state.timeColumn])),
                    y: prefix2.concat(modelPredictData.slice(divide, -1)),
                    type: 'line',
                    name: 'Validation of this Model'
                })

                setNewData(tempData)
                setNextDayData(modelPredictData[modelPredictData.length - 1])
            }
            else {
                const column = state.labelColumn
                const data = state.data4Analyse.map(value => parseFloat(value[column]))
                let max = Math.max(...data)
                let min = Math.min(...data)
                let tempData = []
                let prefix = []
                let suffix = []
                for (let index = 0; index < state.windowSize + 1; index++) {
                    prefix.push(NaN)
                }
                const modelPredictData = prefix.concat(predictionsOfNow(state.data4Analyse, state.model, state.windowSize, true, state.inputColumn, state.labelColumn).map(e => e * (max - min) + min))
                const divide = Math.floor(modelPredictData.length * state.trainingDataSize / 100)
                for (let index = divide; index < state.data4Analyse.length; index++) {
                    suffix.push(NaN)
                }
                let prefix2 = []
                for (let index = 0; index < divide; index++) {
                    prefix2.push(NaN)
                }

                tempData.push({
                    x: state.data4Analyse.map((value) => value[state.timeColumn]),
                    y: data,
                    type: 'line',
                    name: 'Origin Data'
                })
                tempData.push({
                    x: (state.data4Analyse.map((value) => value[state.timeColumn])),
                    y: modelPredictData.slice(0, divide).concat(suffix),
                    type: 'line',
                    name: 'Given by this Model'
                })
                tempData.push({
                    x: (state.data4Analyse.map((value) => value[state.timeColumn])),
                    y: prefix2.concat(modelPredictData.slice(divide, -1)),
                    type: 'line',
                    name: 'Validation of this Model'
                })

                setNewData(tempData)
                setNextDayData(modelPredictData[modelPredictData.length - 1])
            }
        }
        return ()=>{
            setNewData(null)
            setNextDayData(null)
        }
    }, [state.model])
    return (
        <div className={classes.graphContainer}>
            {newData ? createGraph(newData, 'line', 800, 500, state.timeColumn, state.labelColumn[0]) : ''}
            {nextDayData ?
                <Card className={classes.card}>
                    <CardContent>
                        {`At the next time node, ${state.labelColumn[0]} will be ${nextDayData}`}
                    </CardContent>
                </Card>
                :
                ''
            }

        </div>
    )
}

export default LearningResultPage
