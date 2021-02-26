import React from 'react'
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';

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
    inputColumn:{
        position:'relative',
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

function VariableChoose() {
    const classes = useStyles()
    const [state, updateState] = useGlobalState()
    return (
        <div className={classes.root} >
            {state.column.length !== 0 ? <div>请选择时序字段:</div> : ''}
            <div className={classes.choose}>{state.timeColumn}</div>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                {state.column.length !== 0 ?
                    state.column.map((value, index) =>
                        <Button onClick={() => updateState('timeColumn', value)} key={index}>{value}</Button>
                    )
                    :
                    ''
                }
            </ButtonGroup>
            {state.column.length !== 0 ? <div>请选择因变量字段:</div> : ''}
            <div className={classes.choose}>{state.labelColumn}</div>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                {state.column.length !== 0 ?
                    state.column.map((value, index) =>
                        <Button onClick={() => updateState('labelColumn', value)} key={index}>{value}</Button>
                    )
                    :
                    ''
                }
            </ButtonGroup>
            {state.column.length !== 0 ? <div className={classes.inputColumn}>请选择除时序外其余自变量字段:</div> : ''}
            <div className={classes.choose}>{state.inputColumn.join('|')}</div>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                {state.column.length !== 0 ?
                    state.column.map((value, index) =>
                        <Button onClick={() => {
                            let position = state.inputColumn.indexOf(value)
                            let [...tempInputColumn] = state.inputColumn
                            position === -1 ?
                                tempInputColumn.push(value)
                                :
                                tempInputColumn.splice(position, 1)
                            updateState('inputColumn', tempInputColumn)

                        }
                    } key={index}>{value}</Button>
                    )
                    :
                    ''
                }
            </ButtonGroup>
            { state.column.length !== 0 ? <div>请选择常量字段:</div> : ''}
            <div className={classes.choose}>{state.constantColumn.join('|')}</div>
            <ButtonGroup variant="contained" color="primary" aria-label="contained primary button group">
                {state.column.length !== 0 ?
                    state.column.map((value, index) =>
                        <Button onClick={() => {
                            let position = state.constantColumn.indexOf(value)
                            let [...tempConstantColumn] = state.constantColumn
                            position === -1 ?
                                tempConstantColumn.push(value)
                                :
                                tempConstantColumn.splice(position, 1)
                            updateState('constantColumn', tempConstantColumn)
                        }
                        } key={index}>{value}</Button>
                    )
                    :
                    ''
                }
            </ButtonGroup>
        </div >
    )
}

export default VariableChoose
