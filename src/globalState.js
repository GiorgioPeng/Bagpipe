import React, { useState, createContext, useContext, } from 'react';

const GloalStateContext = createContext(null)

const initState = {
    data4Analyse: '', // save the data which format is easy to analyse
    proprocessWay: 'Delelt Null', // the way of data preprocess
    column: [], // the column name array of data
    timeColumn: '', // the time column name of the data
    labelColumn: '', // the output/label column of the data
    inputColumn: [], // the feature/input column of the data
    finishChoose: false, // whether the user finish visualization settings
    windowSize: 20, // the window size of the data 
    hiddenLayers: 4, // the numbers of hidden layers
    epochs: 20,   // the numbers of training epochs
    learnRate: 0.05,  // learning 
    trainingDataSize: 80,  // the size of training
    finishSet: false, // whether the user finish the setting of training neural network
    model: '', // the trained model
    modelResult: '', // the result of the model
    anomalyDataPercentage: 0, // the percentage of the anomaly data
    dropout: 0 // the dropout percentage
    /**
     * [columns...]
     * [row data]
     * [row data]
     */
};
export function GlobalStateProvider({ children }) {
    const [state, setState] = useState(initState);

    const updateState = (key, value) => {
        console.log(key, value)
        setState((lastState) => {
            return {
                ...lastState,
                [key]: value
            }
        })
    }
    const resetState = () => {
        setState(initState)
    }
    return (
        <GloalStateContext.Provider value={[state, updateState, resetState]}>
            {children}
        </GloalStateContext.Provider>
    )
}
export function useGlobalState() {
    return useContext(GloalStateContext)
}