import React from 'react'
import Select from '@material-ui/core/Select';
import Chip from '@material-ui/core/Chip';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: 2,
    }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};
/**
 * 
 * @param {*} value 该选择框绑定的变量, 变量
 * @param {*} f 修改该选择框时触发的函数, 函数
 * @param {*} element 可供选择的元素列表, 数组
 * @param {*} multiple 是否为多选,布尔值
 * @returns 
 */
const CreateChooseDialog = (props) => {
    const { value, f, element, multiple, disabled } = props
    const classes = useStyles()
    return (
        <Select
            disabled={disabled}
            multiple={multiple}
            value={value}
            onChange={f}
            input={<Input />}
            MenuProps={MenuProps}
            renderValue={(selected) => (
                <div className={classes.chips}>
                    {
                        selected.map ?
                            selected.map((value) => (
                                <Chip key={value} label={value} className={classes.chip} />
                            ))
                            :
                            <div className={classes.chips}>
                                <Chip key={selected} label={selected} className={classes.chip} />
                            </div>
                    }
                </div>
            )}
        >
            {element.map((value, index) => (
                <MenuItem key={index} value={value} >
                    {value}
                </MenuItem>
            ))}
        </Select>
    )
}
export default CreateChooseDialog