import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import { withStyles } from '@material-ui/core/styles';
import CreateChooseBar from '../utils/createChooseBar'
import Paper from '@material-ui/core/Paper';
import HelpIcon from '@material-ui/icons/Help';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

const useStyles = makeStyles({
    root: {
        marginTop: '10px',
        marginBottom: '10px',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
    },
    paper: {
        width: '90%',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    }

});



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

function MachineLearnPage() {
    const [state, updateState] = useGlobalState()
    const classes = useStyles()
    const setting = [
        { type: 'Window Size', min: 1, max: 100, defaultNum: 20, step: 1 },
        { type: 'Number of Hidden Layer', min: 1, max: 50, defaultNum: 4, step: 1 },
        { type: 'Epochs', min: 5, max: 500, defaultNum: 25, step: 1 },
        { type: 'Learning Rate', min: 0.01, max: 10, defaultNum: 0.05, step: 0.01 },
        { type: 'Training Dataset Size (%)', min: 1, max: 100, defaultNum: 90, step: 1 },
        { type: 'Number of Neurons', min: 1, max: 20, defaultNum: 3, step: 1 }

    ]
    return (
        <div className={classes.root}>
            {state.finishChoose ?
                <Paper elevation={3} className={classes.paper}>
                    <p>(如果不懂这些选项<HelpIcon fontSize='small' />,请使用默认值)模型训练设置:</p>
                    {
                        setting.map((value, index) =>
                            <CreateChooseBar
                                key={index}
                                type={value.type}
                                min={value.min}
                                max={value.max}
                                defaultNum={value.defaultNum}
                                step={value.step}
                            />
                        )
                    }
                    <FormControlLabel
                        control={
                            <IOSSwitch
                                checked={state.finishSet}
                                onChange={() => updateState('finishSet', !state.finishSet)}
                                name="isFinish" />}
                        label="完成设置"
                    />
                </Paper>
                :
                ''
            }
        </div>
    )
}

export default MachineLearnPage

