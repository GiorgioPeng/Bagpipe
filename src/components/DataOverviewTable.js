import React from 'react'
import { BaseTable } from 'ali-react-table'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { max, min, sum, mean, median, variance, deviation } from 'd3-array';
import Tooltip from '@material-ui/core/Tooltip';
import HelpIcon from '@material-ui/icons/Help';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        // margin: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));
function DataOverviewTable() {
    const [state, updateState] = useGlobalState()
    const classes = useStyles()
    React.useEffect(() => {
        // detect the time column
        if (state.timeColumn === '') {
            let timeColumn = ''
            for (const column of state.column) {
                timeColumn = state.data4Analyse.every((value) => {
                    return isNaN(value[column])
                }) ? column : ''
                if (timeColumn !== '') {
                    break
                }
            }
            updateState('timeColumn', timeColumn)
        }
    }, [state.data4Analyse])
    return (
        <div className={classes.tableContainer}>
            {state.data4Analyse ?
                <BaseTable
                    style={{ maxWidth: 1200, height: 600, overflow: 'auto', fontSize: '15px' }}
                    dataSource={state.data4Analyse}
                    columns={state.column.map(e => {
                        return {
                            code: e,
                            name: e,
                            width: 150,
                            align: 'center',
                            title: (
                                <h2>{e}
                                    <Tooltip
                                        TransitionComponent={Fade}
                                        TransitionProps={{ timeout: 600 }}
                                        title={e !== state.timeColumn ?
                                            (`
                                            max:       ${max(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            min:       ${min(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            sum:       ${sum(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            mean:      ${mean(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            median:    ${median(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            variance:  ${variance(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}\t
                                            deviation: ${deviation(state.data4Analyse, (d) => parseFloat(d[e])).toFixed(2)}
                                        `)
                                            :
                                            ''
                                        }>
                                        <HelpIcon fontSize='small' />
                                    </Tooltip>
                                </h2>
                            )
                        }
                    })}
                />
                :
                ''
            }
        </div>
    )
}

export default DataOverviewTable
