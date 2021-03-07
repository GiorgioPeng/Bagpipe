import { mean, deviation } from 'd3-array';
/**
 * 获得两个相互独立的变量的皮尔逊系数
 * @param {*} objectArr 待分析数据
 * @param {*} column1 第一列
 * @param {*} column2 第二列
 * @returns 这两列的皮尔逊相关系数
 */
const getPearsonCoefficient = (objectArr, column1, column2) => {
    const e1 = mean(objectArr, parseFloat(objectArr[column1]))
    const e2 = mean(objectArr, parseFloat(objectArr[column2]))
    const e12 = e1 * e2
    const std1 = deviation(objectArr, parseFloat(objectArr[column1]))
    const std2 = deviation(objectArr, parseFloat(objectArr[column2]))
    const std12 = std1 * std2
    const coefficient = e12 / std12
    return coefficient
}
export default getPearsonCoefficient