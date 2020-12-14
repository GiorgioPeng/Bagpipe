import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import DataTable from '../components/DataTable'
import dataReader from '../utils/dataReader'
import { useGlobalState } from '../globalState'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));

function UploadPage() {
    const classes = useStyles();
    const [state, updateState] = useGlobalState()
    const fileRef = React.createRef()

    const readCSV = () => {
        const file = fileRef.current.files[0]
        dataReader(file,updateState)
    }

    return (
        <div className={classes.root}>
            <input
                accept="image/*"
                className={classes.input}
                id="contained-button-file"
                multiple
                type="file"
            />
            <label htmlFor="contained-button-file">
                <Button variant="contained" color="primary" component="span">
                    Upload
                </Button>
            </label>
            <input accept=".csv" ref={fileRef} onChange={readCSV} className={classes.input} id="icon-button-file" type="file" />
            <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                    <PhotoCamera />
                </IconButton>
            </label>
            {/* <div>{state.data}</div> */}
            <DataTable/>
        </div>
    );
}

export default UploadPage
