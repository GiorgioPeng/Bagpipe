import React from 'react'
import { useGlobalState } from '../globalState'
import LinePictureDraw from '../components/LinePictureDraw'
function VisualizationPage() {
    const [state, updateState] = useGlobalState()
    return (
        <div>
            {state.data != undefined ?
                <LinePictureDraw />
                :
                ''
            }

        </div>
    )
}

export default VisualizationPage
