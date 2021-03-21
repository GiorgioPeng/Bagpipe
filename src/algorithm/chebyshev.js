import { mean, variance } from 'd3-array';

/**
 * get the anomaly data index array
 * @param {Array} dataArr the origin data
 * @param {Number} probability percentage of anomaly data
 * @param {String} column the aim column name
 * @returns {Array} the array of anomaly data index
 */
const getAnomalyDataIndex = (dataArr, probability, column) => {
    probability = 1 - probability / 100
    const bound = {}
    const indexes = []
    const local_mean = mean(dataArr, (d) => parseFloat(d[column]))
    const local_variance = variance(dataArr, (d) => parseFloat(d[column]))
    const k = Math.sqrt(local_variance / probability)
    bound.top = local_mean + k
    bound.bottom = local_mean - k
    let count = 0;
    for (const row of dataArr) {
        if (row[column] < bound.bottom || row[column] > bound.up)
            indexes.push(count)
        count++;
    }
    return indexes
}

/**
 * remove the anomaly data of a data array
 * @param {Array} dataArr the origin data array
 * @param {Number} probability the percentage of anomaly data
 * @param {Array} columns the array of names of all column which should remove the anomaly data
 * @returns {Array} the result data array
 */
const removeAnomaly = (dataArr, probability, columns) => {
    const result = JSON.parse(JSON.stringify(dataArr))
    let anomalyIndexes = []
    for (const column of columns) {
        anomalyIndexes.push(...getAnomalyDataIndex(dataArr, probability, column))
    }
    anomalyIndexes = [...new Set(anomalyIndexes)] // duplicate removal
    for (const index of anomalyIndexes) {
        result.splice(index, 1)
    }
    return result
}
export default removeAnomaly