import React from 'react'
import { BaseTable } from 'ali-react-table'
import { useGlobalState } from '../globalState'
import { makeStyles } from '@material-ui/core/styles';
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
                    style={{ maxWidth: 1200, height: 500, overflow: 'auto', fontSize: '15px' }}
                    dataSource={state.data4Analyse}
                    columns={state.column.map(e => {
                        return { code: e, name: e, width: 100 }
                    })}
                />
                :
                ''
            }
        </div>
    )
}

export default DataOverviewTable
