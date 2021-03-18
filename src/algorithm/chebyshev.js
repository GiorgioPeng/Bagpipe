import { mean, variance } from 'd3-array';

/**
 * 
 * @param {*} dataArr 原数组
 * @param {*} probability 排除%多少的异常点
 * @param {*} column 某一列列名
 * @returns 异常点索引
 */
const getAnomalyDataIndex = (dataArr, probability, column) => {
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
    // console.log(indexes)
    return indexes
}

/**
 * 
 * @param {*} dataArr 原数组
 * @param {*} probability 排除%多少的异常点
 * @param {*} columns 数组列名
 * @returns 删除异常之后的数组
 */
const removeAnomaly = (dataArr, probability, columns) => {
    const result = JSON.parse(JSON.stringify(dataArr))
    let anomalyIndexes = []
    for (const column of columns) {
        anomalyIndexes.push(...getAnomalyDataIndex(dataArr, probability, column))
    }
    // console.log(anomalyIndexes)
    anomalyIndexes = [...new Set(anomalyIndexes)] // 去重
    for (const index of anomalyIndexes) {
        result.splice(index, 1)
    }
    // console.log(result)
    return result
}
export default removeAnomaly