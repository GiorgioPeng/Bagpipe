import * as tf from '@tensorflow/tfjs'
import * as tfvis from '@tensorflow/tfjs-vis'


async function trainModel(X, Y, window_size, n_epochs, learning_rate, n_layers, callback) {

    const input_layer_shape = window_size;// 训练集形状等于窗口大小
    const input_layer_neurons = 100;// 训练集神经元个数

    const rnn_input_layer_features = 10;
    const rnn_input_layer_timesteps = input_layer_neurons / rnn_input_layer_features;

    const rnn_input_shape = [rnn_input_layer_features, rnn_input_layer_timesteps];
    const rnn_output_neurons = 20;

    const rnn_batch_size = window_size;

    const output_layer_shape = rnn_output_neurons;
    const output_layer_neurons = 1; 

    const model = tf.sequential(); // 创建顺序模型

    const xs = tf.tensor2d(X, [X.length, X[0].length]).div(tf.scalar(10));
    const ys = tf.tensor2d(Y, [Y.length, 1]).reshape([Y.length, 1]).div(tf.scalar(10));

    model.add(tf.layers.dense({ units: input_layer_neurons, inputShape: [input_layer_shape] }));//添加全连接层
    model.add(tf.layers.reshape({ targetShape: rnn_input_shape }));// 变形层

    let lstm_cells = [];
    for (let index = 0; index < n_layers; index++) {
        lstm_cells.push(tf.layers.lstmCell({ units: rnn_output_neurons }));
    }

    model.add(tf.layers.rnn({
        cell: lstm_cells,
        inputShape: rnn_input_shape,
        returnSequences: false
    })); // 添加 rnn 层

    model.add(tf.layers.dense({ units: output_layer_neurons, inputShape: [output_layer_shape] }));

    model.compile({
        optimizer: tf.train.adam(learning_rate),
        loss: 'meanSquaredError'
    });

    const hist = await model.fit(xs, ys,
        {
            batchSize: rnn_batch_size, epochs: n_epochs, callbacks: {
                onEpochEnd: async (epoch, log) => {
                    callback(epoch, log);
                }
            }
        });

    return { model: model, stats: hist };
}
export default trainModel