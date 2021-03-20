/**
 * use inverse distance weighting interpolation to fill the missing data
 * @param {Array} objectArr the origin data array
 * @param {String} column the name of column which should be filled 
 * @return {Array} the result data array
 */
const inverseDistanceWeightingInterpolation = (objectArr, column) => {
    const indexes = [] // store the index of empty value
    objectArr.filter((value, index) => {
        if (isNaN(value[column]) || !value[column]) {
            indexes.push(index)
        }
        return ''
    })
    indexes.forEach(nullIndex => {
        let molecular = 0
        let denominator = 0
        for (let i = 0; i < objectArr.length; i++) {
            if (indexes.indexOf(i) === -1) { // if current cell is not missing
                molecular += parseFloat(objectArr[i][column]) / Math.abs(nullIndex - i)
                denominator += 1 / Math.abs(nullIndex - i)
            }
        }
        objectArr[nullIndex][column] = molecular / denominator
    })
    return objectArr
};

export default inverseDistanceWeightingInterpolation