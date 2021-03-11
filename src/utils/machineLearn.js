import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'

function ComputeSMA(data, windowSize) {
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
    let data2 = ComputeSMA(data, windowSize)
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
export const trainComplexModel = async (x, y, windowSize, neurons, epochs, learningRate, layers) => {
    const inputLayerShape = windowSize
    neurons = 100
    const rnnInputLayerFeatures = 10
    const rnnInputLayerTimesteps = neurons / rnnInputLayerFeatures
    const rnnInputShape = [rnnInputLayerFeatures, rnnInputLayerTimesteps]
    const rnnOutputNeurons = 20

    const rnnBatchSize = windowSize
    const outputLayerShape = rnnOutputNeurons
    const outputLayerNeurons = 1

    const input = tf.tensor3d([...x], [x.length, x[0].length, x[0][0].length])
    const output = tf.tensor2d(y, [y.length, y[0].length])

    const model = tf.sequential()
    model.add(tf.layers.dense({ units: neurons, inputShape: [inputLayerShape] })) // 添加一个全连接层
    model.add(tf.layers.reshape({ targetShape: rnnInputShape })) // 将输出结构变成rnn的输入结构

    let lstmCell = []
    for (let i = 0; i < layers; i++) {
        lstmCell.push(tf.layers.lstmCell({ units: rnnOutputNeurons }));
    }

    model.add(tf.layers.rnn({
        cell: lstmCell,
        inputShape: rnnInputShape,
        returnSequences: false
    })); // 添加 rnn 层

    model.add(tf.layers.dense({ units: outputLayerNeurons, inputShape: [outputLayerShape] })); // 添加输出层

    model.compile({
        optimizer: tf.train.adam(learningRate),
        loss: 'meanSquaredError'
    });

    await model.fit(input, output, {
        batchSize: rnnBatchSize,
        epochs: epochs,
        callbacks: tfvis.show.fitCallbacks(
            { name: '训练效果' },
            ['loss'],
            { callbacks: ['onEpochEnd'] }
        )
    })
}
export const makePredictions = (input, model) => {
    console.log(input)
    const x = tf.tensor2d(input, [input.length, input[0].length])
    x.print()
    const predictedResults = model.predict(x);
    return Array.from(predictedResults.dataSync());
}