import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

/**
 * 计算简单移动平均
 * @param {*} data 数据,一维数组
 * @param {*} windowSize 窗口大小
 * @returns 
 */
function computeSimpleMoveAverage(data, windowSize) {
    {
        let max = Math.max(...data)
        let min = Math.min(...data)
        data = data.map(value => (value - min) / (max - min))
    } // 先进行归一化

    const result = []
    for (let i = 0; i < data.length - windowSize; i++) {
        let currentAverage = 0
        let t = i + windowSize // 时间跨度
        for (let k = i; k < t && k <= data.length; k++) {
            currentAverage += data[k] // 先进求和
        }
        currentAverage /= windowSize // 这里再求平均
        result.push({ x: data.slice(i, i + windowSize), y: currentAverage })
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
    let data2 = computeSimpleMoveAverage(data, windowSize)
    const x = data2.map(e => e.x)
    const y = data2.map(e => e.y)
    const _xTest = x.slice(Math.floor(trainingDataSize / 100 * x.length), x.length)
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    const _yTest = y.slice(Math.floor(trainingDataSize / 100 * y.length), y.length)
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

    const input = tf.tensor2d(inputX, [inputX.length, inputX[0].length]) // [X,20]
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])  // [X]
    const xTest = tf.tensor2d(_xTest, [_xTest.length, _xTest[0].length]) // [X,20]
    const yTest = tf.tensor2d(_yTest, [_yTest.length, 1]).reshape([_yTest.length, 1])  // [X]

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
        validationData: [xTest, yTest],//设置验证集
        callbacks: tfvis.show.fitCallbacks(
            { name: 'RESULT' },
            ['loss', 'val_loss', 'acc', 'val_acc'],//训练集损失，验证集损失，训练集准确度，验证集准确度
            { callbacks: ['onEpochEnd'] }
        )
    })
    return { model: model, modelResult: modelResult }
}

/**
 * 
 * @param {*} x 样本数组
 * @param {*} y 标签数组
 * @param {*} windowSize 窗口大小,也是步长
 * @param {*} neurons 神经云个数
 * @param {*} epochs 训练次数
 * @param {*} learningRate 学习速率
 * @param {*} layers lstm cell 层数
 */
export const trainComplexModel = async (data, windowSize, epochs, learningRate, layers, trainingDataSize) => {
    let data2 = computeSimpleMoveAverage(data, windowSize)
    const x = data2.map(e => e.x)
    const y = data2.map(e => e.y)
    const _xTest = x.slice(Math.floor(trainingDataSize / 100 * x.length), x.length)
    const inputX = x.slice(0, Math.floor(trainingDataSize / 100 * x.length))
    const _yTest = y.slice(Math.floor(trainingDataSize / 100 * y.length), y.length)
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

    const input = tf.tensor2d(inputX, [inputX.length, inputX[0].length]) // [X,20]
    const output = tf.tensor2d(inputY, [inputY.length, 1]).reshape([inputY.length, 1])  // [X]
    const xTest = tf.tensor2d(_xTest, [_xTest.length, _xTest[0].length]) // [X,20]
    const yTest = tf.tensor2d(_yTest, [_yTest.length, 1]).reshape([_yTest.length, 1])  // [X]

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
        validationData: [xTest, yTest],//设置验证集
        callbacks: tfvis.show.fitCallbacks(
            { name: 'RESULT' },
            ['loss', 'val_loss', 'acc', 'val_acc'],//训练集损失，验证集损失，训练集准确度，验证集准确度
            { callbacks: ['onEpochEnd'] }
        )
    })
    return { model: model, modelResult: modelResult }
}

/**
 * 通过现有数据得到模型计算出的数据
 * @param {*} input 输出的数据,为一个一维数组
 * @param {*} model 构建好的模型
 * @param {*} windowSize 窗口大小
 * @returns 
 */
export const predictionsOfNow = (input, model, windowSize) => {
    input = computeSimpleMoveAverage(input, windowSize)
    input = input.map(e => e.x)
    const x = tf.tensor2d(input, [input.length, input[0].length])
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
    input = computeSimpleMoveAverage(input, windowSize)
    input = input.map(e => e.x).slice(Math.floor(trainingDataSize / 100 * input.length), input.length)
    input = [input[input.length-1]]
    const x = tf.tensor2d(input, [input.length, input[0].length])
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}