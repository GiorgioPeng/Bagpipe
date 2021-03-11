import React from 'react'
import { useGlobalState } from '../globalState'
import { makePredictions } from '../utils/machineLearn'
import createGraph from '../utils/createGraph'
function LearningResultPage() {
    const [state,] = useGlobalState()
    const { newData, setNewData } = React.useState(null)
    React.useEffect(() => {
        if (state.model) {
            const column = state.labelColumn
            const data = state.data4Analyse.map(value => parseFloat(value[column]))
            let max = Math.max(...data)
            let min = Math.min(...data)
            let tempData = []
            tempData.push({
                x: state.data4Analyse.map((value) => value[state.timeColumn]),
                y: makePredictions(data, state.model).map(e => e * (max - min) + min),
                type: 'line',
                name: 'Predict'
            })
            tempData.push({
                x: state.data4Analyse.map((value) => value[state.timeColumn]),
                y: data,
                type: 'line',
                name: 'Origin'
            })
            setNewData(tempData)
        }
    }, [state.model])
    return (
        <div>
            {newData ? createGraph(newData, 'line', 800, 500, state.timeColumn, state.labelColumn[0]) : ''}
        </div>
    )
}

export default LearningResultPage
