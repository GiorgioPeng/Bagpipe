import pearsonCoefficient from './pearsonCoefficient'
/**
 * 
 * @param {*} objectArr 待处理对象数据数组
 * @param {*} columns 该对象数组的所有列
 * @returns 
 */
const hotDecking = (objectArr, columns) => {
    const pearsonCoefficientArr = getCoefficient(objectArr, columns)
    // console.log(pearsonCoefficientArr)
    for (const column of columns) { // 一列一列的来
        const indexes = [] // 存储在当前列为空数值的索引
        objectArr.filter((value, index) => {
            if (isNaN(value[column]) || !value[column]) {
                indexes.push(index)
            }
            return ''
        })
        const { columnIndex, coefficient } = pearsonCoefficientArr.shift()
        if (indexes.length === 0) { // 如果该列没有缺失数据
            continue
        }
        else {
            indexes.forEach(i => {
                // console.log(objectArr, columns, columnIndex)
                const columnData = objectArr.map((e) => { return e[columns[columnIndex]] })
                const likelyIndex = findLikely(i, columnData, coefficient > 0 ? true : false)
                objectArr[i][column] = objectArr[likelyIndex][column]
            })
        }
    }
    return objectArr
};

/**
 * 
 * @param {*} objectArr 带分析的数据对象数组
 * @param {*} columns 对象的列信息
 * @returns 每个列对应的相关系数和索引(一个数组)
 */
const getCoefficient = (objectArr, columns) => {
    const pearsonCoefficientArr = [] // 用于存储 该数组索引对应的列 最相关的列的 索引
    for (let columnCount = 0; columnCount < columns.length; columnCount++) {

        const tempPearsonCoefficientArr = [] // 用于临时存储一个列和其他列的皮尔逊系数

        for (let index = 0; index < columns.length; index++) { // 分别计算特定列与其余每一列的皮尔逊系数
            if (index === columnCount) { // 找到自己的时候直接跳过
                continue;
            }
            else {
                tempPearsonCoefficientArr.push(pearsonCoefficient(objectArr, columns[columnCount], columns[index]))
            }
        }
        // console.log(tempPearsonCoefficientArr)
        tempPearsonCoefficientArr.splice(columnCount, 0, 0)
        pearsonCoefficientArr.push(indexOfAbsMax(tempPearsonCoefficientArr))
    }
    // let temp = Object.assign({}, pearsonCoefficientArr)
    // console.log(temp)
    return pearsonCoefficientArr
}

/**
 * 
 * @param {*} arr 需要寻找最大值的数组
 * @returns 该数组绝对值最大值的索引 和 对应的值
 */
function indexOfAbsMax(arr) {
    // console.log(arr)
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
    // console.log({ columnIndex: maxIndex, coefficient: arr[maxIndex] })
    return { columnIndex: maxIndex, coefficient: arr[maxIndex] };
}

/**
 * 
 * @param {*} index 需要寻找相近值的数据的索引
 * @param {*} columnData 需要寻找的列数据(也就是和缺失列最相关的列的数据)
 * @param {*} inverse 正相关或者负相关
 * @returns 最相近值的索引
 */
const findLikely = (index, columnData, inverse) => {
    // console.log(columnData, index)
    let likelyIndex = -1 // 最相近的对应的索引
    const value = columnData[index]
    if (inverse) { // 如果两者是正相关
        let difference = Number.MAX_SAFE_INTEGER // 先将差赋值为最大值,方面后续选择
        for (let i = 0; i < columnData.length; i++) {

            if (isNaN(columnData[i]) || !columnData[i]) //如果这列缺失直接走
                continue

            if (i !== index) {// 当没有找到自身时进行算
                let tempDifference = Math.abs(parseFloat(columnData[i]) - value)
                if (tempDifference < difference) {
                    difference = tempDifference
                    likelyIndex = i
                }
            }

        }
    }
    else {  // 如果两者是负相关
        let difference = Number.MIN_SAFE_INTEGER // 先将差赋值为最小值,方面后续选择
        for (let i = 0; i < columnData.length; i++) {

            if (isNaN(columnData[i]) || !columnData[i]) //如果这列缺失直接走
                continue

            if (i !== index) {// 当没有找到自身时进行算
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