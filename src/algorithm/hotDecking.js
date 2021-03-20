import pearsonCoefficient from './pearsonCoefficient'
/**
 * use hot decking to filled the missing data
 * @param {Array} objectArr the origin data array
 * @param {Array} columns a array of names of all column which are features
 * @returns {Array} the result of filled data array
 */
const hotDecking = (objectArr, columns) => {
    const pearsonCoefficientArr = getCoefficient(objectArr, columns)
    for (const column of columns) { // line by line
        const indexes = [] // store the indexes of empty value
        objectArr.filter((value, index) => {
            if (isNaN(value[column]) || !value[column]) {
                indexes.push(index)
            }
            return ''
        })
        const { columnIndex, coefficient } = pearsonCoefficientArr.shift()
        if (indexes.length === 0) { // if no data missing
            continue
        }
        else {
            indexes.forEach(i => {
                const columnData = objectArr.map((e) => { return e[columns[columnIndex]] })
                const likelyIndex = findLikely(i, columnData, coefficient > 0 ? true : false)
                objectArr[i][column] = objectArr[likelyIndex][column]
            })
        }
    }
    return objectArr
};

/**
 * get peason ceofficient between each two feature columns
 * @param {Array} objectArr the origin data array
 * @param {Array} columns a array of names of all column which are features
 * @returns {Array} a array of object which include the pearson ceoffient and correpsonding two indexes of columns
 */
const getCoefficient = (objectArr, columns) => {
    const pearsonCoefficientArr = [] // store the corresponding indexes of the columns
    for (let columnCount = 0; columnCount < columns.length; columnCount++) {

        const tempPearsonCoefficientArr = [] // store a column and other columns pearson ceofficient

        for (let index = 0; index < columns.length; index++) { 
            if (index === columnCount) { // skip when itself
                continue;
            }
            else {
                tempPearsonCoefficientArr.push(pearsonCoefficient(objectArr, columns[columnCount], columns[index]))
            }
        }
        tempPearsonCoefficientArr.splice(columnCount, 0, 0)
        pearsonCoefficientArr.push(indexOfAbsMax(tempPearsonCoefficientArr))
    }
    return pearsonCoefficientArr
}

/**
 * get the index of maximum value (absolute) of a array
 * @param {Array} arr the aim array
 * @returns {Object} an object include the maximum value and its index
 */
function indexOfAbsMax(arr) {
    if (arr.length === 0) {
        return -1;
    }
    let max = Math.abs(arr[0]);
    let maxIndex = 0;
    for (let i = 1; i < arr.length; i++) {
        if (Math.abs(arr[i]) > max) {
            maxIndex = i;
            max = Math.abs(arr[i]);
        }
    }
    return { columnIndex: maxIndex, coefficient: arr[maxIndex] };
}

/**
 * find the index of most likely value of the missing value in a column
 * @param {Number} index the index of missing data
 * @param {Array} columnData the data of column
 * @param {Boolean} inverse a boolean value of Positive or negative correlation
 * @returns {Number} the index of most likely value
 */
const findLikely = (index, columnData, inverse) => {
    let likelyIndex = -1 // aim index
    const value = columnData[index]
    if (inverse) { // positive correlation
        let difference = Number.MAX_SAFE_INTEGER 
        for (let i = 0; i < columnData.length; i++) {

            if (isNaN(columnData[i]) || !columnData[i]) // skip for missing data
                continue

            if (i !== index) {
                let tempDifference = Math.abs(parseFloat(columnData[i]) - value)
                if (tempDifference < difference) {
                    difference = tempDifference
                    likelyIndex = i
                }
            }

        }
    }
    else {  // negative correlation
        let difference = Number.MIN_SAFE_INTEGER 
        for (let i = 0; i < columnData.length; i++) {

            if (isNaN(columnData[i]) || !columnData[i]) // skip for missing data
                continue

            if (i !== index) {
                let tempDifference = Math.abs(parseFloat(columnData[i]) - value)
                if (tempDifference > difference) {
                    difference = tempDifference
                    likelyIndex = i
                }
            }

        }
    }
    return likelyIndex
}

export default hotDecking;