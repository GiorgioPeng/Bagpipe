import React, { useState, createContext, useContext, } from 'react';

const GloalStateContext = createContext(null)

const initState = {
    data: undefined
    /**
     * [columns...]
     * [row data]
     * [row data]
     */
};

export function GlobalStateProvider({ children }) {
    const [state, setState] = useState(initState);

    const updateState = (key,value)=>{
        console.log(key,value)
        setState((lastState)=>{
            return{
                ...lastState,
                [key]:value
            }
        })
    }
    return (
        <GloalStateContext.Provider value={[state, updateState]}>
            {children}
        </GloalStateContext.Provider>
    )
}
export function useGlobalState() {
    return useContext(GloalStateContext)
}