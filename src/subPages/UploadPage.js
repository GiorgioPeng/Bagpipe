import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import dataReader from '../utils/dataReader'
import { useGlobalState } from '../globalState'

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            // margin: theme.spacing(1),
        },
    },

    input: {
        display: 'none',
    },
    uploadButton: {
        marginTop:'10px',
        marginBottom:'10px',
        height: 40,
        width: 250,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        left: '50%',
        cursor: 'pointer',
        transform: 'translateX(-50%)',
        '& > p': {
            fontSize: '14px',
            position: 'relative',
        },
        '&:hover': {
            '&:after': {
                content: "'Only .csv format supporting now!'",
                position: 'absolute',
                fontSize: '18px',
                color: 'red',
                // top: '80%',
                left: '150%',
                transform: 'translateX(-50%)',
                whiteSpace: 'nowrap',
            }
        }
    },
}));

function UploadPage() {
    const classes = useStyles();
    const [, updateState, resetState] = useGlobalState()
    const fileRef = React.createRef()

    const readCSV = () => {
        resetState()
        const file = fileRef.current.files[0]
        dataReader(file, updateState)
    }

    return (
        <div className={classes.root}>
            <input accept=".csv" ref={fileRef} onChange={readCSV} className={classes.input} id="icon-button-file" type="file" />
            <label className={classes.uploadButton} htmlFor="icon-button-file">
                <Button variant="contained" color="primary" component="span"  startIcon={<CloudUploadIcon />}>
                    Upload Dataset
                </Button>
            </label>
        </div>
    );
}

export default UploadPage
