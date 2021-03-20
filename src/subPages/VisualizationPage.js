import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import Divider from '@material-ui/core/Divider';
import VariableChoose from '../components/VariableChoose'
import LinePicture from '../components/LinePicture'
import BarPicture from '../components/BarPicture'
import HistogramsPicture from '../components/HistogramsPicture'
import SunburstPicture from '../components/SunburstPicture'
import ParallelCoordinatesPicture from '../components/ParallelCoordinatesPicture'
import DataOverviewTable from '../components/DataOverviewTable'

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        margin: '5px'
    }
}));

function VisualizationPage() {
    const classes = useStyles();
    const [state,] = useGlobalState()
    return (
        <div>
            <div className={classes.tableContainer}>
                <DataOverviewTable />
                <Divider variant="middle" />
                <VariableChoose />
            </div>
            {state.finishChoose ?
                <>
                    {/* <Cluster /> */}
                    <LinePicture />
                    <BarPicture />
                    <HistogramsPicture />
                    <ParallelCoordinatesPicture />
                    <SunburstPicture />
                    {/* <SortStatisticTable /> */}
                </>
                :
                ''
            }

        </div>
    )
}

export default VisualizationPage
