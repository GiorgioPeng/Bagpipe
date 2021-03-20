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
        backgroundColor:'#f8edeb'
    }
}));
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            backgroundColor:'#fcefb4',
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 300,
        },
    },
};
/**
 * create a choose dialog
 * @param {Array} value the value which should be binded to the dialog
 * @param {Function} f the callback of modify the value of the dialog
 * @param {Array} element the choosable value, an array
 * @param {Boolean} multiple whether the dialog allow multiple choose
 * @returns {HTMLelement} the HTML element of the choose dialog
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