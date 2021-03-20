import { sum } from 'd3-array';
/**
 * get the pearson ceofficient of two columns
 * @param {Array} objectArr the data 
 * @param {String} column1 the name of the first column
 * @param {String} column2 the name of the seconde column
 * @returns {Number} the pearson ceofficient of the two columns
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
    const coefficient = molecular / denominator
    return isNaN(coefficient) ? 0 : coefficient
}
export default getPearsonCoefficient