import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import { max, min, sum, mean, median, variance, deviation } from 'd3-array';
import { useGlobalState } from '../globalState'

/**
 * 
 * @param {*} label 数据列名
 * @param {*} max 最大值
 * @param {*} min 最小值
 * @param {*} sum 和
 * @param {*} mean 平均值
 * @param {*} median 中位数
 * @param {*} variance 方差
 * @param {*} deviation 标准差
 */
function createData(label, max, min, sum, mean, median, variance, deviation) {
    return { label, max, min, sum, mean, median, variance, deviation };
}

/**
 * 
 * @param {*} a 
 * @param {*} b 
 * @param {*} orderBy 需要排序的字段
 */
function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

/**
 * 
 * @param {*} order 升序或者降序
 * @param {*} orderBy 需要排序的字段
 */
function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const headCells = [
    { id: 'label', numeric: false, disablePadding: true, label: 'Column Name' },
    { id: 'max', numeric: true, disablePadding: false, label: 'Max' },
    { id: 'min', numeric: true, disablePadding: false, label: 'Min' },
    { id: 'sum', numeric: true, disablePadding: false, label: 'Sum' },
    { id: 'mean', numeric: true, disablePadding: false, label: 'Mean' },
    { id: 'median', numeric: true, disablePadding: false, label: 'Median' },
    { id: 'variance', numeric: true, disablePadding: false, label: 'Variance' },
    { id: 'deviation', numeric: true, disablePadding: false, label: 'Deviation' },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };
    return (
        <TableHead>
            <TableRow>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        className={classes.headCellText}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'default'}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

// EnhancedTableHead.propTypes = {
//     classes: PropTypes.object.isRequired,
//     numSelected: PropTypes.number.isRequired,
//     onRequestSort: PropTypes.func.isRequired,
//     onSelectAllClick: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     rowCount: PropTypes.number.isRequired,
// };


const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paper: {
        width: '90%',
        marginBottom: theme.spacing(2),
    },
    tableContainer: {
        paddingLeft: '5px',
        paddingRight: '5px'
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
    rowLabel: {
        fontWeight: '600'
    },
    headCellText:{
        fontWeight:'bolder',
        color:'#444'
    }
}));

export default function EnhancedTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('');
    const [rows, setRows] = React.useState(null);
    const [state,] = useGlobalState();
    const tempRows = []
    React.useEffect(() => {
        for (const label of state.labelColumn) {
            tempRows.push(
                createData(
                    label,
                    max(state.data4Analyse, (d) => parseFloat(d[label])),
                    min(state.data4Analyse, (d) => parseFloat(d[label])),
                    sum(state.data4Analyse, (d) => parseFloat(d[label])),
                    mean(state.data4Analyse, (d) => parseFloat(d[label])),
                    median(state.data4Analyse, (d) => parseFloat(d[label])),
                    variance(state.data4Analyse, (d) => parseFloat(d[label])),
                    deviation(state.data4Analyse, (d) => parseFloat(d[label])),
                )
            );
        }
        for (const label of state.inputColumn) {
            tempRows.push(
                createData(
                    label,
                    max(state.data4Analyse, (d) => parseFloat(d[label])),
                    min(state.data4Analyse, (d) => parseFloat(d[label])),
                    sum(state.data4Analyse, (d) => parseFloat(d[label])),
                    mean(state.data4Analyse, (d) => parseFloat(d[label])),
                    median(state.data4Analyse, (d) => parseFloat(d[label])),
                    variance(state.data4Analyse, (d) => parseFloat(d[label])),
                    deviation(state.data4Analyse, (d) => parseFloat(d[label])),
                )
            );
        }
        setRows(tempRows)
    }, [])
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };


    return (
        <div className={classes.root}>
            {
                rows ?
                    <Paper className={classes.paper}>
                        <TableContainer className={classes.tableContainer}>
                            <Table
                                aria-labelledby="tableTitle"
                                size='medium'
                                aria-label="enhanced table"
                            >
                                <EnhancedTableHead
                                    classes={classes}
                                    order={order}
                                    orderBy={orderBy}
                                    onRequestSort={handleRequestSort}
                                    rowCount={rows.length}
                                />
                                <TableBody>
                                    {stableSort(rows, getComparator(order, orderBy))
                                        .map((row, index) => {
                                            return (
                                                <TableRow
                                                    hover
                                                    tabIndex={-1}
                                                    key={index}
                                                >
                                                    <TableCell component="th" className={classes.rowLabel} scope="row" padding="none">
                                                        {row.label}
                                                    </TableCell>
                                                    <TableCell align="right">{row.max}</TableCell>
                                                    <TableCell align="right">{row.min}</TableCell>
                                                    <TableCell align="right">{row.sum}</TableCell>
                                                    <TableCell align="right">{row.mean}</TableCell>
                                                    <TableCell align="right">{row.median}</TableCell>
                                                    <TableCell align="right">{row.variance}</TableCell>
                                                    <TableCell align="right">{row.deviation}</TableCell>
                                                </TableRow>
                                            );
                                        })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                    :
                    ''
            }
        </div>
    );
}
