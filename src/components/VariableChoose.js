import React from 'react'
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import CreateChooseDialog from '../utils/createChooseDialog'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import linearInterpolation from '../algorithm/linearInterpolation'
import inverseDistanceWeightingInterpolation from '../algorithm/inverseDistanceWeightingInterpolation'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%'
    },
    choose: {
        color: 'red',
        fontWeight: 'bold'
    },
    hint: {
        display: 'flex',
        alignItems: 'center'
    },
    inputColumn: {
        position: 'relative',
        '&:hover': {
            '&:after': {
                content: "'自变量个数增多会导致训练时长激增'",
                position: 'absolute',
                fontSize: '18px',
                color: 'red',
                // top: '80%',
                left: '100%',
                // transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
            }
        }
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

function VariableChoose() {
    const classes = useStyles()
    const [state, updateState] = useGlobalState()
    const handleTimeColumnChange = (event) => {
        if (state.finishChoose) {
            return
        }
        updateState('timeColumn', event.target.value)
    };
    const handleInputColumnChange = (event) => {
        if (state.finishChoose) {
            return
        }
        updateState('inputColumn', event.target.value)
    };
    const handleLabelColumnChange = (event) => {
        if (state.finishChoose) {
            return
        }
        updateState('labelColumn', event.target.value)
    };
    const handleProprocessWayChange = (event) => {
        if (state.finishChoose) {
            return
        }
        updateState('proprocessWay', event.target.value)
    };
    return (
        <div className={classes.root} >
            {state.column.length !== 0 ?
                <>
                    <div>请选择数据清洗方式:</div>
                    <CreateChooseDialog
                        value={state.proprocessWay}
                        f={handleProprocessWayChange}
                        element={['Delelt Null', 'Linear Interpolation', 'Inverse Distance Weighting', '热卡填充法(Hotdecking)']}
                        multiple={false}
                    />
                    {/* todo: 进行预处理 */}

                    <div className={classes.hint}><Typography color={'secondary'} variant={'h4'}>*</Typography>请选择时序字段:</div>
                    <CreateChooseDialog
                        value={state.timeColumn}
                        f={handleTimeColumnChange}
                        element={state.column}
                        multiple={false}
                    />

                    <div className={classes.inputColumn}>请选择除时序外其余自变量字段:</div>
                    <CreateChooseDialog
                        value={state.inputColumn}
                        f={handleInputColumnChange}
                        element={state.column}
                        multiple={true}
                    />

                    <div className={classes.hint}><Typography color={'secondary'} variant={'h4'}>*</Typography>请选择因变量字段:</div>
                    <CreateChooseDialog
                        value={state.labelColumn}
                        f={handleLabelColumnChange}
                        element={state.column}
                        multiple={true}
                    />

                    <FormControlLabel
                        control={
                            <IOSSwitch
                                checked={state.finishChoose}
                                onChange={() => {
                                    if (state.labelColumn.length !== 0 && state.timeColumn.length !== 0) {
                                        updateState('finishChoose', !state.finishChoose)
                                        // updateState('data4Analyse',inverseDistanceWeightingInterpolation(state.data4Analyse,'value1'))
                                    }
                                    else
                                        updateState('finishChoose', false)

                                }
                                }
                                name="isFinishChoose" />}
                        label="完成设置"
                    />
                </>
                : ''}
        </div >
    )
}

export default VariableChoose
