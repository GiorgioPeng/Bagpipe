import React, { useState, createContext, useContext, } from 'react';

const GloalStateContext = createContext(null)

const initState = {
    data: undefined,// 这里保存的是当次需要分析的用于可视化表格的数据
    data4Analyse: '', // 这里保存的是用于分析的数据格式
    proprocessWay: '删除空值', // 数据预处理方式
    column: [], // 这里保存的是当次需要分析的数据中所有的表头名称
    timeColumn: '', // 这里保存的是时序字段的字段名称
    labelColumn: [], // 这里保存的是因变量字段
    inputColumn: [], // 这里保存的是其余自变量字段
    finishChoose: false, // 这里保存的是是否用户设置完变量的变量
    windowSize: 20, // 数据窗口大小
    hiddenLayers: 4, // 隐藏层数量
    epochs: 25,   // 训练次数
    learnRate: 0.05,  // 学习速率
    trainingDataSize: 90,  // 训练集大小
    neurons: 3, // 每层神经元个数
    finishSet: false
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