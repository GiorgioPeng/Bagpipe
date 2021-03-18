import React from 'react'
import { BaseTable } from 'ali-react-table'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
import { max, min, sum, mean, median, variance, deviation } from 'd3-array';
import Tooltip from '@material-ui/core/Tooltip';
import Fade from '@material-ui/core/Fade';
// import createGraph from '../utils/createGraph'

const useStyles = makeStyles((theme) => ({
    tableContainer: {
        margin: '5px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
}));
function DataOverviewTable() {
    const [state, updateState] = useGlobalState()
    const classes = useStyles()
    React.useEffect(() => {
        // 通常来说, 日期格式不能转化成数字, 通过 isNaN函数来预先判断一个列是不是数字格式
        let timeColumn = ''
        for (const column of state.column) {
            timeColumn = state.data4Analyse.every((value) => {
                // console.log(value[column])
                return isNaN(value[column])
            }) ? column : ''
            if (timeColumn !== '') {
                break
            }
        }
        updateState('timeColumn', timeColumn)
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
                                    <h4>{e}</h4>
                                    {/* {state.timeColumn?<StatisticGraph data={state.data4Analyse} column={e} timeColumn={state.timeColumn}/>:''} */}
                                </Tooltip>
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