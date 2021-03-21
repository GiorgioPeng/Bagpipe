import React from 'react'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CreateChooseDialog from '../utils/createChooseDialog'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Fade from '@material-ui/core/Fade';
import Slider from '@material-ui/core/Slider';
import linearInterpolation from '../algorithm/linearInterpolation'
import inverseDistanceWeightingInterpolation from '../algorithm/inverseDistanceWeightingInterpolation'
import hotDecking from '../algorithm/hotDecking'
import deleteNull from '../algorithm/deleteNull'
import removeAnomaly from '../algorithm/chebyshev'
import HelpIcon from '@material-ui/icons/Help';
import getPearsonCoefficient from '../algorithm/pearsonCoefficient'
import Cluster from './Cluster'

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    choose: {
        color: 'red',
        fontWeight: 'bold'
    },
    require: {
        display: 'flex',
        alignItems: 'center'
    },
    text: {
        margin: '10px'
    },
    button: {
        fontSize: '10px'
    }
}));

const IOSSwitch = withStyles((theme) => ({
    root: {
        width: 42,
        height: 26,
        padding: 0,
        margin: theme.spacing(1),
    },
    switchBase: {
        padding: 1,
        '&$checked': {
            transform: 'translateX(16px)',
            color: theme.palette.common.white,
            '& + $track': {
                backgroundColor: '#52d869',
                opacity: 1,
                border: 'none',
            },
        },
        '&$focusVisible $thumb': {
            color: '#52d869',
            border: '6px solid #fff',
        },
    },
    thumb: {
        width: 24,
        height: 24,
    },
    track: {
        borderRadius: 26 / 2,
        border: `1px solid ${theme.palette.grey[400]}`,
        backgroundColor: theme.palette.grey[50],
        opacity: 1,
        transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
}))(({ classes, ...props }) => {
    return (
        <Switch
            focusVisibleClassName={classes.focusVisible}
            disableRipple
            classes={{
                root: classes.root,
                switchBase: classes.switchBase,
                thumb: classes.thumb,
                track: classes.track,
                checked: classes.checked,
            }}
            {...props}
        />
    );
});


const iOSBoxShadow =
    '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.13),0 0 0 1px rgba(0,0,0,0.02)';
const marks = [
    {
        value: 0,
    },
    {
        value: 10,
    },
    {
        value: 25,
    },
    {
        value: 50,
    },
];

const IOSSlider = withStyles({
    root: {
        marginTop: '12px',
        width: '20vw',
        color: '#3880ff',
        height: 2,
        padding: '15px 0',
    },
    thumb: {
        height: 28,
        width: 28,
        backgroundImage: 'radial-gradient(#f5efff, #a594f9, #e5d9f2)',
        boxShadow: iOSBoxShadow,
        marginTop: -14,
        marginLeft: -14,
        '&:focus, &:hover, &$active': {
            boxShadow: '0 3px 1px rgba(0,0,0,0.1),0 4px 8px rgba(0,0,0,0.3),0 0 0 1px rgba(0,0,0,0.02)',
            '@media (hover: none)': {
                boxShadow: iOSBoxShadow,
            },
        },
    },
    active: {},
    valueLabel: {
        left: 'calc(-50% + 12px)',
        top: -22,
        '& *': {
            background: 'transparent',
            color: '#000',
        },
    },
    track: {
        height: 2,
    },
    rail: {
        height: 2,
        opacity: 0.5,
        backgroundColor: '#bfbfbf',
    },
    mark: {
        backgroundColor: '#bfbfbf',
        height: 8,
        width: 1,
        marginTop: -3,
    },
    markActive: {
        opacity: 1,
        backgroundColor: 'currentColor',
    },
})(Slider);

function VariableChoose() {
    const classes = useStyles()
    const [state, updateState] = useGlobalState()
    const [isClear, setIsClear] = React.useState(false)
    const [relative, setRelative] = React.useState([])
    const [anomalyDataPercentage, setAnomalyDataPercentage] = React.useState(0)
    const handleTimeColumnChange = (event) => {
        updateState('timeColumn', event.target.value)
    };
    const handleInputColumnChange = (event) => {
        updateState('inputColumn', event.target.value)
    };
    const handleLabelColumnChange = (event) => {
        updateState('labelColumn', [event.target.value])
        let tempInputColumn = []
        let relativeArr = []
        for (const column of state.column) {
            if (column === event.target.value || column === state.timeColumn) {
                continue;
            }
            else {
                let temp = getPearsonCoefficient(state.data4Analyse, column, event.target.value).toFixed(5)
                relativeArr.push({ column1: event.target.value, column2: column, pearsonCoefficient: temp })
                if (Math.abs(temp) > 0.8) {
                    tempInputColumn.push(column)
                }
            }
        }
        setRelative(relativeArr)

        if (state.inputColumn.length === 0) {  // if the input column array is empty, set it
            updateState('inputColumn', tempInputColumn)
        }
    };
    const handleProprocessWayChange = (event) => {
        updateState('proprocessWay', event.target.value)
    };
    const handleAnomalyDataPercentageChange = (event, newValue) => {
        // setTimeout(() => updateState('anomalyDataPercentage', newValue), 0) // avoid ui refresh be blockd
        setAnomalyDataPercentage(newValue)
    }
    const finishAndDataClean = () => {
        if (state.labelColumn.length !== 0 && state.timeColumn.length !== 0) {
            updateState('finishChoose', !state.finishChoose)
            if (!isClear) {
                setIsClear(true)
                const columns = JSON.parse(JSON.stringify(state.inputColumn))
                let tempDataObj;
                switch (state.proprocessWay) {
                    case 'Delelt Null':
                        tempDataObj = JSON.parse(JSON.stringify(state.data4Analyse))
                        for (const column of columns) {
                            tempDataObj = deleteNull(tempDataObj, column)
                        }
                        tempDataObj = deleteNull(tempDataObj, state.labelColumn)
                        break;
                    case 'Linear Interpolation':
                        tempDataObj = JSON.parse(JSON.stringify(state.data4Analyse))
                        for (const column of columns) {
                            tempDataObj = linearInterpolation(tempDataObj, column)
                        }
                        tempDataObj = deleteNull(tempDataObj, state.labelColumn)
                        break;
                    case 'Inverse Distance Weighting':
                        tempDataObj = JSON.parse(JSON.stringify(state.data4Analyse))
                        for (const column of columns) {
                            tempDataObj = inverseDistanceWeightingInterpolation(tempDataObj, column)
                        }
                        tempDataObj = deleteNull(tempDataObj, state.labelColumn)
                        break;
                    case 'Hot Decking':
                        tempDataObj = JSON.parse(JSON.stringify(state.data4Analyse))
                        tempDataObj = hotDecking(tempDataObj, columns)
                        tempDataObj = deleteNull(tempDataObj, state.labelColumn)
                        break;
                    default:
                        tempDataObj = JSON.parse(JSON.stringify(state.data4Analyse))
                        break;
                }
                if (anomalyDataPercentage !== 0) {
                    updateState('anomalyDataPercentage', anomalyDataPercentage)
                    console.log(anomalyDataPercentage)
                    updateState('data4Analyse', removeAnomaly(tempDataObj, anomalyDataPercentage, [state.labelColumn]))
                }
                else {
                    updateState('data4Analyse', tempDataObj)
                }
            }
        }
        else
            updateState('finishChoose', false)

    }

    return (
        <div className={classes.root} >
            {state.column.length !== 0 ?
                <>
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={'Hot Decking can only be used in multiple feature situation!'}>
                        <div>Please choose data filled way:</div>
                    </Tooltip>
                    <CreateChooseDialog
                        disabled={state.finishChoose || isClear ? true : false}
                        value={state.proprocessWay}
                        f={handleProprocessWayChange}
                        element={['Delelt Null', 'Linear Interpolation', 'Inverse Distance Weighting', 'Hot Decking']}
                        multiple={false}
                    />

                    <div className={classes.require}><Typography color={'secondary'} variant={'h4'}>*</Typography>Please choose time column:</div>
                    <CreateChooseDialog
                        disabled={state.finishChoose ? true : false}
                        value={state.timeColumn}
                        f={handleTimeColumnChange}
                        element={state.column}
                        multiple={false}
                    />


                    <div className={classes.require}><Typography color={'secondary'} variant={'h4'}>*</Typography>
                        <Typography gutterBottom>Please choose mining aim column:</Typography>
                        <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={'This column will be what you want to analyse and predict!'}>
                            <HelpIcon fontSize='small' />
                        </Tooltip>
                    </div>
                    <CreateChooseDialog
                        disabled={state.finishChoose ? true : false}
                        value={state.labelColumn}
                        f={handleLabelColumnChange}
                        element={state.column}
                        multiple={false}
                    />

                    <Typography className={classes.text} gutterBottom>Please choose input features:
                        <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={'The default selection is made by correlation, but can be modified'}>
                            <HelpIcon fontSize='small' />
                        </Tooltip>
                    </Typography>
                    <CreateChooseDialog
                        disabled={state.finishChoose ? true : false}
                        value={state.inputColumn}
                        f={handleInputColumnChange}
                        element={state.column}
                        multiple={true}
                    />

                    <Cluster relativeArr={relative} />

                    <Typography className={classes.text} gutterBottom>
                        Anomaly Data Percentage:
                        <Tooltip
                            TransitionComponent={Fade}
                            TransitionProps={{ timeout: 600 }}
                            title={'Pay attention of using the option! Please estimate the percentage of anomaly data in your dataset before setting this!'}>
                            <HelpIcon fontSize='small' />
                        </Tooltip>
                    </Typography>
                    <IOSSlider aria-label="ios slider" disabled={state.finishChoose ? true : false} marks={marks} onChange={handleAnomalyDataPercentageChange} value={anomalyDataPercentage} max={50} valueLabelDisplay="on" />
                    <Tooltip
                        TransitionComponent={Fade}
                        TransitionProps={{ timeout: 600 }}
                        title={state.labelColumn === '' ? 'You should choose mining aim column or time column at first!' : ''}>
                        <FormControlLabel
                            control={
                                <IOSSwitch
                                    checked={state.finishChoose}
                                    onChange={finishAndDataClean}
                                    name="isFinishChoose" />}
                            label="Finish"
                        />
                    </Tooltip>
                </>
                : ''}
        </div >
    )
}

export default VariableChoose
