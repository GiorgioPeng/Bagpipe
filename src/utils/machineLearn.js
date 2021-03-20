import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

/**
 * bulid input features and output label
 * @param {Array} data data, 1 dimension array
 * @param {Number} windowSize window size of the data
 * @returns {Array} the result of input and output
 */
function computeInputAndOutput(data, windowSize) {
    {
        let max = Math.max(...data)
        let min = Math.min(...data)
        data = data.map(value => (value - min) / (max - min))
    } // normalisation 

    const result = []
    for (let i = 0; i <= data.length - windowSize - 1; i++) {
        result.push({ x: data.slice(i, i + windowSize), y: data[i + windowSize + 1] })
    }
    return result
}

/**
 * build the nerual network of 1 dimension feature
 * @param {Array} data input data
 * @param {Number} windowSize window size of the data
 * @param {Number} epochs numbers of training epochs
 * @param {Number} learningRate learning rate
 * @param {Number} layers numbers of hidden layers
 * @param {Number} trainingDataSize training data size
 * @returns {Object} the model of the network
 */
export const trainSimpleModel = async (data, windowSize, epochs, learningRate, layers, trainingDataSize) => {
    console.log('trainSimpleModel')
    let data2 = computeInputAndOutput(data, windowSize)
    const x = data2.map(e => e.x)
    const y = data2.map(e => e.y)
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    const inputY = y.slice(0, Math.floor(trainingDataSize / 100 * y.length))

    const inputLayerShape = windowSize
    const lstmNeurons = 20
    const lstmInputLayerFeatures = 10
    const lstmInputLayerTimesteps = lstmNeurons / lstmInputLayerFeatures

    const lstmInputShape = [lstmInputLayerFeatures, lstmInputLayerTimesteps]
    const lstmOutputNeurons = 20

    const lstmBatchSize = windowSize
    const outputLayerShape = lstmOutputNeurons
    const outputLayerNeurons = 1

    const input = tf.tensor2d(inputX, [inputX.length, inputX[0].length])
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])
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
 * build the nerual network with multiple input features
 * @param {Array} data input data
 * @param {Number} windowSize window size of input 
 * @param {Number} epochs numbers of training epochs
 * @param {Number} learningRate learning rate
 * @param {Number} layers network layers
 * @param {Number} trainingDataSize training data size
 * @param {Array} inputColumn feature column name array
 * @param {String} labelColumn output column name
 * @returns {Object} the model of the network
 */
export const trainComplexModel = async (data, windowSize, epochs, learningRate, layers, trainingDataSize, inputColumn, labelColumn) => {
    console.log('trainComplexModel')
    let data1 = [] 
    for (const column of inputColumn) {
        data1.push(computeSimpleMoveAverage(data.map(value => parseFloat(value[column])), windowSize).map(e => e.x)) // 对每一个变量进行特者提取
    }

    let data2 = computeSimpleMoveAverage(data.map(value => parseFloat(value[labelColumn])), windowSize)
    data1.push(data2.map(e => e.x))
    const x = []
    const y = data2.map(e => e.y)
    for (let index1 = 0; index1 < data1[0].length; index1++) { 
        let tempArr = [] 
        for (let index2 = 0; index2 < data1.length; index2++) {
            tempArr.push(data1[index2][index1])
        }
        x.push(tempArr)
    }
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    const inputY = y.slice(0, Math.floor(trainingDataSize / 100 * y.length))

    const inputLayerShape = inputColumn.length + 1
    const lstmNeurons = 20
    const lstmInputLayerFeatures = 10
    const lstmInputLayerTimesteps = lstmNeurons / lstmInputLayerFeatures

    const lstmInputShape = [lstmInputLayerFeatures, lstmInputLayerTimesteps]
    const lstmOutputNeurons = 20

    const lstmBatchSize = windowSize
    const outputLayerShape = lstmOutputNeurons
    const outputLayerNeurons = 1

    const input = tf.tensor2d(inputX)
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])  // [X]
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
        loss: tf.losses.huberLoss,
    });

    const modelResult = await model.fit(input, output, {
        batchSize: lstmBatchSize,
        epochs: epochs,
        callbacks: tfvis.show.fitCallbacks(
            { name: 'RESULTs' },
            ['loss'],
            { callbacks: ['onEpochEnd', 'onBatchEnd'] }
        )
    })
    const modelSummary = { name: 'Model Summary', tab: 'Model Inspection' };
    tfvis.show.modelSummary(modelSummary, model);

    return { model: model, modelResult: modelResult }
}

/**
 * descending dimension of the input data base on simple move average
 * @param {Array} data input data
 * @param {Number} windowSize window size of the data
 * @returns {Array} the feature and ouput before handling
 */
function computeSimpleMoveAverage(data, windowSize) {
    {
        let max = Math.max(...data)
        let min = Math.min(...data)
        data = data.map(value => (value - min) / (max - min))
    }

    const result = []
    for (let i = 0; i <= data.length - windowSize - 1; i++) {
        let currentAverage = 0
        let t = i + windowSize 
        for (let k = i; k < t && k <= data.length; k++) {
            currentAverage += data[k]
        }
        currentAverage /= windowSize 
        result.push({ x: currentAverage, y: data[i + windowSize + 1] })
    }
    return result
}


/**
 * use training data and model get the output 
 * @param {Array} input input data
 * @param {Model} model the mode
 * @param {Number} windowSize window size of the data
 * following parameters only used by the complex model
 * @param {Boolean} isComplex whether is a complex model
 * @param {Array} inputColumn feature column name array
 * @param {String} labelColumn label column name
 * @returns {Array} the result of prediction
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
            data1.push(computeSimpleMoveAverage(input.map(value => parseFloat(value[column])), windowSize).map(e => e.x)) // 对每一个变量进行特者提取
        }

        let data2 = computeSimpleMoveAverage(input.map(value => parseFloat(value[labelColumn])), windowSize)
        data1.push(data2.map(e => e.x))
        const xInput = []
        for (let index1 = 0; index1 < data1[0].length; index1++) {
            let tempArr = [] 
            for (let index2 = 0; index2 < data1.length; index2++) {
                tempArr.push(data1[index2][index1])
            }
            xInput.push(tempArr)
        }
        x = tf.tensor2d(xInput)
    }
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}

/**
 * predict the data of the next time node
 * @param {Array} input input data
 * @param {Model} model the model of the trained network
 * @param {Number} windowSize window size of the data
 * @param {Number} trainingDataSize training data set
 * @returns {Array} the output array
 */
export const makePredictions = (input, model, windowSize, trainingDataSize, isComplex, inputColumn, labelColumn) => {
    let x
    if (!isComplex) {
        input = computeInputAndOutput(input, windowSize)
        input = input.map(e => e.x).slice(Math.floor(trainingDataSize / 100 * input.length), input.length)
        input = [input[input.length - 1]]
        x = tf.tensor2d(input, [input.length, input[0].length])
    }
    else {
        let data1 = []
        for (const column of inputColumn) {
            data1.push(computeSimpleMoveAverage(input.map(value => parseFloat(value[column])), windowSize).map(e => e.x)) // 对每一个变量进行特者提取
        }

        let data2 = computeSimpleMoveAverage(input.map(value => parseFloat(value[labelColumn])), windowSize)
        data1.push(data2.map(e => e.x))
        let xInput = []
        for (let index1 = 0; index1 < data1[0].length; index1++) { 
            let tempArr = [] 
            for (let index2 = 0; index2 < data1.length; index2++) { 
                tempArr.push(data1[index2][index1])
            }
            xInput.push(tempArr)
        }
        xInput = [xInput[xInput.length - 1]]
        x = tf.tensor2d(xInput)
    }
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}
