import React from 'react'
import { useGlobalState } from '../globalState'
import VariableChoose from '../components/VariableChoose'
import LinePicture from '../components/LinePicture'
import BarPicture from '../components/BarPicture'
import HistogramsPicture from '../components/HistogramsPicture'
import SunburstPicture from '../components/SunburstPicture'
import ParallelCoordinatesPicture from '../components/ParallelCoordinatesPicture'
import DataOverviewTable from '../components/DataOverviewTable'


function VisualizationPage() {
    const [state,] = useGlobalState()
    return (
        <>
            <div>
                <DataOverviewTable />
                {/* <Divider variant="middle" /> */}
                <VariableChoose />
            </div>
            {state.finishChoose ?
                <>
                    <LinePicture />
                    <BarPicture />
                    <HistogramsPicture />
                    <ParallelCoordinatesPicture />
                    <SunburstPicture />
                </>
                :
                ''
            }
        </>
    )
}

export default VisualizationPage
