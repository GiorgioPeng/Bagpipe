import React from 'react'
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

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
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
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
    return (
        <div className={classes.root} >
            {state.column.length !== 0 ?
                <>
                    <div>请选择时序字段:</div>
                    <Select
                        value={state.timeColumn}
                        onChange={handleTimeColumnChange}
                        input={<Input />}
                        MenuProps={MenuProps}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                <Chip key={selected} label={selected} className={classes.chip} />
                            </div>
                        )}
                    >
                        {state.column.map((value, index) => (
                            <MenuItem key={index} value={value} >
                                {value}
                            </MenuItem>
                        ))}
                    </Select>

                    <div className={classes.inputColumn}>请选择除时序外其余自变量字段:</div>
                    <Select
                        multiple
                        value={state.inputColumn}
                        onChange={handleInputColumnChange}
                        input={<Input />}
                        MenuProps={MenuProps}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                    >
                        {state.column.map((value, index) => (
                            <MenuItem key={index} value={value} >
                                {value}
                            </MenuItem>
                        ))}
                    </Select>

                    <div>请选择因变量字段:</div>
                    <Select
                        multiple
                        value={state.labelColumn}
                        onChange={handleLabelColumnChange}
                        input={<Input />}
                        MenuProps={MenuProps}
                        renderValue={(selected) => (
                            <div className={classes.chips}>
                                {selected.map((value) => (
                                    <Chip key={value} label={value} className={classes.chip} />
                                ))}
                            </div>
                        )}
                    >
                        {state.column.map((value, index) => (
                            <MenuItem key={index} value={value} >
                                {value}
                            </MenuItem>
                        ))}
                    </Select>

                    <FormControlLabel
                        control={<IOSSwitch checked={state.finishChoose} onChange={() => updateState('finishChoose', !state.finishChoose)} name="isFinishChoose" />}
                        label="完成设置"
                    />
                </>
                : ''}
        </div >
    )
}

export default VariableChoose
