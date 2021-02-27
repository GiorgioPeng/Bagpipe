import React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Switch from '@material-ui/core/Switch';
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
    return (
        <div className={classes.root} >
            {state.column.length !== 0 ?
                <>
                    <div>请选择时序字段:</div>
                    <div className={classes.choose}>{state.timeColumn}</div>
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        {state.column.length !== 0 ?
                            state.column.map((value, index) =>
                                <Button onClick={() => {
                                    if (state.finishChoose) {
                                        return
                                    } updateState('timeColumn', value)
                                }
                                } key={index}>{value}</Button>
                            )
                            :
                            ''
                        }
                    </ButtonGroup>
                    <div className={classes.inputColumn}>请选择除时序外其余自变量字段:</div>
                    <div className={classes.choose}>{state.inputColumn.join('|')}</div>
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        {state.column.map((value, index) =>
                            <Button onClick={() => {
                                if (state.finishChoose) {
                                    return
                                }
                                let position = state.inputColumn.indexOf(value)
                                let [...tempInputColumn] = state.inputColumn
                                position === -1 ?
                                    tempInputColumn.push(value)
                                    :
                                    tempInputColumn.splice(position, 1)
                                updateState('inputColumn', tempInputColumn)
                            }
                            } key={index}>{value}</Button>
                        )}
                    </ButtonGroup>
                    <div>请选择因变量字段:</div>
                    <div className={classes.choose}>{state.labelColumn.join('|')}</div>
                    <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                        {state.column.map((value, index) =>
                            <Button onClick={() => {
                                if (state.finishChoose) {
                                    return
                                }
                                let position = state.labelColumn.indexOf(value)
                                let [...tempLabelColumn] = state.labelColumn
                                position === -1 ?
                                    tempLabelColumn.push(value)
                                    :
                                    tempLabelColumn.splice(position, 1)
                                updateState('labelColumn', tempLabelColumn)
                            }
                            } key={index}>{value}</Button>
                        )}
                    </ButtonGroup>

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
