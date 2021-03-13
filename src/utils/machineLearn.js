import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

/**
 * 特征构造和标签提取
 * @param {*} data 数据,一维数组
 * @param {*} windowSize 窗口大小
 * @returns 
 */
function computeInputAndOutput(data, windowSize) {
    {
        let max = Math.max(...data)
        let min = Math.min(...data)
        data = data.map(value => (value - min) / (max - min))
    } // 先进行归一化

    const result = []
    for (let i = 0; i <= data.length - windowSize - 1; i++) {
        // let currentAverage = 0
        // let t = i + windowSize // 时间跨度
        // for (let k = i; k < t && k <= data.length; k++) {
        //     currentAverage += data[k] // 先进求和
        // }
        // currentAverage /= windowSize // 这里再求平均
        result.push({ x: data.slice(i, i + windowSize), y: data[i + windowSize + 1] })
    }
    // console.log(result)
    return result
}

/**
 * 
 * @param {*} x 标签数据数组,也是用这个构造输入
 * @param {*} windowSize 步长或者窗口大小
 * @param {*} neurons 神经元数量
 * @param {*} epochs 训练次数 
 * @param {*} learningRate 学习速率
 * @param {*} layers lstmcell个数
 */
export const trainSimpleModel = async (data, windowSize, epochs, learningRate, layers, trainingDataSize) => {
    let data2 = computeInputAndOutput(data, windowSize)
    const x = data2.map(e => e.x)
    const y = data2.map(e => e.y)
    // const _xTest = x.slice(Math.floor(trainingDataSize / 100 * x.length), x.length)
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    // const inputX = x
    // const _yTest = y.slice(Math.floor(trainingDataSize / 100 * y.length), y.length)
    const inputY = y.slice(0, Math.floor(trainingDataSize / 100 * y.length))
    // const inputY = y
    // console.log(_xTest, inputX, _yTest, inputY)

    const inputLayerShape = windowSize
    const lstmNeurons = 20
    const lstmInputLayerFeatures = 10
    const lstmInputLayerTimesteps = lstmNeurons / lstmInputLayerFeatures

    const lstmInputShape = [lstmInputLayerFeatures, lstmInputLayerTimesteps]
    const lstmOutputNeurons = 20

    const lstmBatchSize = windowSize
    const outputLayerShape = lstmOutputNeurons
    const outputLayerNeurons = 1

    const input = tf.tensor2d(inputX, [inputX.length, inputX[0].length]) // [X,20]
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])  // [X]
    // const xTest = tf.tensor2d(_xTest, [_xTest.length, _xTest[0].length]) // [X,20]
    // const yTest = tf.tensor2d(_yTest, [_yTest.length, 1]).reshape([_yTest.length, 1])  // [X]
    // console.log(input,output,xTest,yTest)
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: lstmNeurons, inputShape: [inputLayerShape] }))

    model.add(tf.layers.reshape({ targetShape: lstmInputShape }))
    if (layers !== 1) {
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            inputShape: lstmInputShape,
            returnSequences: true
        }))

        for (let i = 1; i < layers - 1; i++) {
            model.add(tf.layers.lstm({
                units: lstmNeurons,
                returnSequences: true
            }))
        }
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            returnSequences: false
        }))
    }
    else {
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            inputShape: lstmInputShape,
            returnSequences: false
        }))
    }

    model.add(tf.layers.dense({ units: outputLayerNeurons, inputShape: [outputLayerShape] }))

    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: 'meanSquaredError'
    });

    const modelResult = await model.fit(input, output, {
        batchSize: lstmBatchSize,
        epochs: epochs,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'RESULTs' },
            ['loss', 'acc'],
            { callbacks: ['onEpochEnd', 'onBatchEnd'] }
        )
    })
    const modelSummary = { name: 'Model Summary', tab: 'Model Inspection' };
    tfvis.show.modelSummary(modelSummary, model);

    return { model: model, modelResult: modelResult }
}

/**
 * 
 * @param {*} data 对象数据数组
 * @param {*} windowSize 窗口大小
 * @param {*} epochs 训练次数
 * @param {*} learningRate 学习速率
 * @param {*} layers 隐藏层数量
 * @param {*} trainingDataSize 训练集比例
 * @param {*} inputColumn 其余输入变量
 * @param {*} labelColumn 输出变量
 * @returns 
 */
export const trainComplexModel = async (data, windowSize, epochs, learningRate, layers, trainingDataSize, inputColumn, labelColumn) => {
    let data1 = [] // 这个数组用于装所有特征 [ [ [],[] ],[ [],[] ] ] 第一维为特征种类个数, 第二维为 特征组 的数量, 第三维为该组内特征的具体数值
    for (const column of inputColumn) {
        data1.push(computeInputAndOutput(data.map(value => parseFloat(value[column])), windowSize).map(e => e.x)) // 对每一个变量进行特者提取
    }

    let data2 = computeInputAndOutput(data.map(value => parseFloat(value[labelColumn])), windowSize)
    data1.push(data2.map(e => e.x))


    const x = data1
    const y = data2.map(e => e.y)
    // const _xTest = x.slice(Math.floor(trainingDataSize / 100 * x.length), x.length)
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    // const inputX = x
    // const _yTest = y.slice(Math.floor(trainingDataSize / 100 * y.length), y.length)
    const inputY = y.slice(0, Math.floor(trainingDataSize / 100 * y.length))
    // const inputY = y
    // console.log(_xTest, inputX, _yTest, inputY)

    const inputLayerShape = windowSize
    const lstmNeurons = 20
    const lstmInputLayerFeatures = 10
    const lstmInputLayerTimesteps = lstmNeurons / lstmInputLayerFeatures

    const lstmInputShape = [lstmInputLayerFeatures, lstmInputLayerTimesteps]
    const lstmOutputNeurons = 20

    const lstmBatchSize = windowSize
    const outputLayerShape = lstmOutputNeurons
    const outputLayerNeurons = 1

    // const input = tf.tensor2d(inputX, [inputX.length, inputX[0].length, input[0][0].length]) // [X,20]
    const input = tf.tensor3d(inputX, [inputX.length, inputX[0].length, inputX[0][0].length])
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])  // [X]
    // const xTest = tf.tensor2d(_xTest, [_xTest.length, _xTest[0].length]) // [X,20]
    // const yTest = tf.tensor2d(_yTest, [_yTest.length, 1]).reshape([_yTest.length, 1])  // [X]
    // console.log(input,output,xTest,yTest)
    const model = tf.sequential()
    model.add(tf.layers.dense({ units: lstmNeurons, inputShape: [inputX[0].length, inputLayerShape] }))

    model.add(tf.layers.reshape({ targetShape: lstmInputShape }))
    if (layers !== 1) {
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            inputShape: lstmInputShape,
            returnSequences: true
        }))

        for (let i = 1; i < layers - 1; i++) {
            model.add(tf.layers.lstm({
                units: lstmNeurons,
                returnSequences: true
            }))
        }
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            returnSequences: false
        }))
    }
    else {
        model.add(tf.layers.lstm({
            units: lstmNeurons,
            inputShape: lstmInputShape,
            returnSequences: false
        }))
    }

    model.add(tf.layers.dense({ units: outputLayerNeurons, inputShape: [outputLayerShape] }))

    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: 'meanSquaredError'
    });

    const modelResult = await model.fit(input, output, {
        batchSize: lstmBatchSize,
        epochs: epochs,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'RESULTs' },
            ['loss', 'acc'],
            { callbacks: ['onEpochEnd', 'onBatchEnd'] }
        )
    })
    const modelSummary = { name: 'Model Summary', tab: 'Model Inspection' };
    tfvis.show.modelSummary(modelSummary, model);

    return { model: model, modelResult: modelResult }
}

function computeSimpleMoveAverage(data, windowSize) {
    {
        let max = Math.max(...data)
        let min = Math.min(...data)
        data = data.map(value => (value - min) / (max - min))
    } // 先进行归一化

    const result = []
    for (let i = 0; i <= data.length - windowSize - 1; i++) {
        let currentAverage = 0
        let t = i + windowSize // 时间跨度
        for (let k = i; k < t && k <= data.length; k++) {
            currentAverage += data[k] // 先进求和
        }
        currentAverage /= windowSize // 这里再求平均
        result.push({ x: currentAverage, y: data[i + windowSize + 1] })
    }
    // console.log(result)
    return result
}
/**
 * 通过现有数据得到模型计算出的数据
 * @param {*} input 输出的数据,为一个一维数组, 如果是复杂模型,这就是一个对象数组
 * @param {*} model 构建好的模型
 * @param {*} windowSize 窗口大小
 * 以下参数仅为复杂模型使用
 * @param {*} isComplex 是否为复杂模型
 * @param {*} inputColumn 输入数组
 * @param {*} labelColumn 标签数组
 * @returns 
 */
export const predictionsOfNow = (input, model, windowSize, isComplex, inputColumn, labelColumn) => {
    let x
    if (!isComplex) {
        input = computeInputAndOutput(input, windowSize)
        input = input.map(e => e.x)
        x = tf.tensor2d(input, [input.length, input[0].length])
    }
    else {
        let data1 = []
        for (const column of inputColumn) {
            data1.push(computeInputAndOutput(input.map(value => parseFloat(value[column])), windowSize).map(e => e.x)) // 对每一个变量进行特者提取
        }

        let data2 = computeInputAndOutput(input.map(value => parseFloat(value[labelColumn])), windowSize)
        data1.push(data2.map(e => e.x))
        x = tf.tensor3d(data1)
    }
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}

/**
 * 预测下一天的数据
 * @param {*} input  
 * @param {*} model 构建好的模型
 * @param {*} windowSize 窗口大小
 * @param {*} trainingDataSize 训练数据集百分比
 * @returns 
 */
export const makePredictions = (input, model, windowSize, trainingDataSize) => {
    input = computeInputAndOutput(input, windowSize)
    input = input.map(e => e.x).slice(Math.floor(trainingDataSize / 100 * input.length), input.length)
    input = [input[input.length - 1]]
    const x = tf.tensor2d(input, [input.length, input[0].length])
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}