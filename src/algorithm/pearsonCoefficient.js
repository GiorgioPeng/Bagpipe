import { sum } from 'd3-array';
/**
 * 获得两个相互独立的变量的皮尔逊系数
 * @param {*} objectArr 待分析数据
 * @param {*} column1 第一列
 * @param {*} column2 第二列
 * @returns 这两列的皮尔逊相关系数
 */
const getPearsonCoefficient = (objectArr, column1, column2) => {
    const n = objectArr.length
    const sum_1 = sum(objectArr, row => parseFloat(row[column1]))
    const sum_2 = sum(objectArr, row => parseFloat(row[column2]))
    let sum_1_2 = 0
    objectArr.forEach((row) => {
        if (!isNaN(row[column1]) && !isNaN(row[column2]) && row[column1] && row[column2]) {
            sum_1_2 += parseFloat(row[column1]) * parseFloat(row[column2])
            return
        }
    })

    let sum_1_1 = 0
    let sum_2_2 = 0
    objectArr.forEach((row) => {
        if (!isNaN(row[column1]) && !isNaN(row[column2]) && row[column1] && row[column2]) {
            sum_1_1 += parseFloat(row[column1]) ** 2
            sum_2_2 += parseFloat(row[column2]) ** 2
        }
    })

    const molecular = sum_1_2 - (sum_1 * sum_2 / n)
    const denominator = Math.sqrt((sum_1_1 - (sum_1 ** 2) / n) * (sum_2_2 - (sum_2 ** 2) / n))
    // console.log(sum_1, sum_2, sum_1_2, sum_1_1, sum_2_2)
    // console.log(molecular, denominator)
    const coefficient = molecular / denominator
    return isNaN(coefficient) ? 0 : -coefficient
}
export default getPearsonCoefficient