/**
 * use linear interpolation to fill the data
 * @param {Array} objectArr the origin data array
 * @param {String} column the name of the column which should be filled
 * @return {Array} the result data arry
 */
const linearInterpolation = (objectArr, column) => {
    const indexes = [] // store the index of empty value
    const nearIndexes = [] // store the nearest index of non-empty value
    objectArr.filter((value, index) => {
        if (isNaN(value[column]) || !value[column]) {
            indexes.push(index)
            const tempIndex = {} 
            for (let i = index - 1; i >= 0; i--) {
                if (isNaN(objectArr[i][column]) || !value[column]) { // find before non-empty value index
                    tempIndex.last = i
                    break
                }
            }

            for (let i = index + 1; i < objectArr.length; i++) {
                if (isNaN(objectArr[i][column]) || !value[column]) {// find next non-empty value index
                    tempIndex.next = i
                    break
                }
            }
            if (tempIndex.last === undefined) {
                tempIndex.last = -1
            }
            if (!tempIndex.next === undefined) {
                tempIndex.next = -1
            }
            nearIndexes.push(tempIndex)
        }
        return ''
    })
    if (objectArr.length > 1) {
        for (let i = 0; i < indexes.length; i++) {
            if (nearIndexes[i]['last'] === -1) {
                objectArr[indexes[i]][column] = objectArr[nearIndexes[i]['next']][column]
                continue
            }
            if (nearIndexes[i]['next'] === -1) {
                objectArr[indexes[i]][column] = objectArr[nearIndexes[i]['last']][column]
                continue
            }
            objectArr[indexes[i]][column] = coreAlgorithm(
                indexes[i],
                parseInt(nearIndexes[i]['last']),
                parseInt(nearIndexes[i]['next']),
                parseFloat(objectArr[nearIndexes[i]['last']][column]),
                parseFloat(objectArr[nearIndexes[i]['next']][column])
            )
        }
    }
    return objectArr
}

/**
 * compute the value which should be filled to the empty position
 * @param {Number} index the index of empty value
 * @param {Number} indexA last non-empty value index
 * @param {Number} indexB next non-empty value index
 * @param {Number} valueA last nont-empty value
 * @param {Number} valueB next non-empty value
 * @returns {Number} the value of computing result
 */

const coreAlgorithm = (index, indexA, indexB, valueA, valueB) => {
    return ((valueB - valueA) / (indexB - indexA)) * (index - indexA) + valueA
}
export default linearInterpolation