import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import DataTable from '../components/DataTable'
import VariableChoose from '../components/VariableChoose'
import LinePicture from '../components/LinePicture'
import BarPicture from '../components/BarPicture'
import HistogramsPicture from '../components/HistogramsPicture'
import SortStatisticTable from '../components/SortStatisticTable'
import SunburstPicture from '../components/SunburstPicture'
import Paper from '@material-ui/core/Paper'

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        margin: '5px'
    }
}));

function VisualizationPage() {
    const classes = useStyles();
    const [state, updateState] = useGlobalState()
    return (
        <div>
            <div className={classes.tableContainer}>
                <DataTable />
                <Paper elevation={3}>
                    <VariableChoose />
                </Paper>
            </div>
            {state.finishChoose ?
                <>
                    {/* <LinePictureDraw /> */}
                    <LinePicture />
                    <BarPicture />
                    <HistogramsPicture />
                    {/* <SunburstPicture /> */}
                    <SortStatisticTable />
                </>
                :
                ''
            }

        </div>
    )
}

export default VisualizationPage
