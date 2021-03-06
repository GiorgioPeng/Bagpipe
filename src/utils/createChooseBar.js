import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useGlobalState } from '../globalState'
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Input from '@material-ui/core/Input';
import CropLandscapeIcon from '@material-ui/icons/CropLandscape'; // 窗口大小设置
import FilterNoneIcon from '@material-ui/icons/FilterNone'; // 网络层数设置
import DeviceHubIcon from '@material-ui/icons/DeviceHub'; // 神经元个数设置
import SpeedIcon from '@material-ui/icons/Speed'; // 学习速率
import RepeatIcon from '@material-ui/icons/Repeat'; //训练次数
import PhotoSizeSelectSmallIcon from '@material-ui/icons/PhotoSizeSelectSmall'; // 训练集大小

const useStyles = makeStyles({
    root: {
        width: 250,
    },
    input: {
        width: 60,
    },
});

/**
 * 
 * @param {*} props 包含类型,最大值,最小值,每次调节步长
 * @returns 
 */
const CreateChooseBar = (props) => {
    const classes = useStyles();
    const [state, updateState] = useGlobalState()
    const { type, min, max, step, defaultNum } = props
    const [value, setValue] = React.useState(defaultNum);

    const update = (newValue) => {
        switch (type) {
            case 'Window Size':
                updateState('windowSize', newValue)
                break;
            case 'Number of Hidden Layer':
                updateState('hiddenLayers', newValue)
                break;
            case 'Epochs':
                updateState('epochs', newValue)
                break;
            case 'Learning Rate':
                updateState('learnRate', newValue)
                break;
            case 'Training Dataset Size (%)':
                updateState('trainingDataSize', newValue)
                break;
            default:
                updateState('neurons', newValue)
                break;
        }
    }

    React.useEffect(() => {
        update(value)
    }, [state.finishSet])

    const handleSliderChange = (event, newValue) => {
        if (!state.finishSet)
            setValue(newValue);
    };

    const handleInputChange = (event) => {
        if (!state.finishSet)
            setValue(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleBlur = () => {
        if (!state.finishSet)
            if (value < min) {
                setValue(min);
            } else if (value > max) {
                setValue(max);
            }
    };

    return (
        <div className={classes.root}>
            <Typography id="input-slider" gutterBottom color={'secondary'} variant={'body2'}>
                {type}
            </Typography>
            <Grid container spacing={2} alignItems="center">
                <Grid item>
                    {
                        type === 'Window Size' ?
                            <CropLandscapeIcon />
                            :
                            type === 'Number of Hidden Layer' ?
                                <FilterNoneIcon />
                                :
                                type === 'Epochs' ?
                                    <RepeatIcon />
                                    :
                                    type === 'Learning Rate' ?
                                        <SpeedIcon />
                                        :
                                        type === 'Training Dataset Size (%)' ?
                                            <PhotoSizeSelectSmallIcon />
                                            :
                                            < DeviceHubIcon />
                    }
                </Grid>
                <Grid item xs>
                    <Slider
                        value={typeof value === 'number' ? value : defaultNum}
                        onChange={handleSliderChange}
                        min={min}
                        max={max}
                        step={step}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        className={classes.input}
                        value={value}
                        margin="dense"
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        inputProps={{
                            step: step,
                            min: min,
                            max: max,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                    />
                </Grid>
            </Grid>
        </div>
    );
}
export default CreateChooseBar