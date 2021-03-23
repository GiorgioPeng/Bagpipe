import { mean, variance } from 'd3-array';

/**
 * get the anomaly data index array
 * @param {Array} dataArr the origin data
 * @param {Number} probability percentage of anomaly data
 * @param {String} column the aim column name
 * @returns {Array} the array of anomaly data index
 */
const getAnomalyDataIndex = (dataArr, probability, column) => {
    probability = probability / 100
    const bound = {}
    const indexes = []
    const local_mean = mean(dataArr, (d) => parseFloat(d[column]))
    const local_variance = variance(dataArr, (d) => parseFloat(d[column]))
    const k = Math.sqrt(local_variance / probability)
    bound.top = local_mean + k
    bound.bottom = local_mean - k
    let count = 0;
    for (const row of dataArr) {
        if (row[column] <= bound.bottom || row[column] >= bound.top)
            indexes.push(count)
        count++;
    }
    return { indexes: indexes, bound: bound }
}

/**
 * remove the anomaly data of a data array
 * @param {Array} dataArr the origin data array
 * @param {Number} probability the percentage of anomaly data
 * @param {Array} columns the array of names of all column which should remove the anomaly data
 * @returns {Object} the result data array, the removed elements and bound detail
 */
const removeAnomaly = (dataArr, probability, columns) => {
    const result = JSON.parse(JSON.stringify(dataArr))
    const removedElement = []
    const hint = []
    let anomalyIndexes = []
    let temp;
    for (const column of columns) {
        temp = getAnomalyDataIndex(dataArr, probability, column[0])
        anomalyIndexes.push(...temp.indexes)
        hint.push({ column: column[0], bound: temp.bound })
    }
    anomalyIndexes = [...new Set(anomalyIndexes)] // duplicate removal
    let count = 0;
    for (const index of anomalyIndexes) {
        removedElement.push(...result.splice(index + count, 1))
        count--;
    }
    // console.log(result,removedElement)
    return { result: result, removedElement: removedElement, hint: hint }
}
export default removeAnomaly