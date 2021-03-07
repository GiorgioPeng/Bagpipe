import pearsonCoefficient from './pearsonCoefficient'
/**
 * 
 * @param {*} objectArr 待处理对象数据数组
 * @param {*} columns 该对象数组的所有列
 * @returns 
 */
const hotDecking = (objectArr, columns) => {
    const pearsonCoefficientArr = getCoefficient(objectArr, columns)
    for (const column of columns) { // 一列一列的来
        const indexes = [] // 存储存在为空数值的索引
        objectArr.filter((value, index) => {
            if (!parseInt(value[column]) || !parseFloat(value[column])) {
                indexes.push(index)
            }
        })

    }
    return objectArr
};

/**
 * 
 * @param {*} objectArr 带分析的数据对象数组
 * @param {*} columns 对象的列信息
 * @returns 每个列对应的相关系数和索引
 */
const getCoefficient = (objectArr, columns) => {
    const pearsonCoefficientArr = [] // 用于存储 该数组索引对应的列 最相关的列的 索引
    for (let columnCount = 0; columnCount < columns.length; columnCount++) {
        const tempPearsonCoefficientArr = [] // 用于临时存储一个列和其他列的皮尔逊系数
        for (let index = 0; index < columns.length; index++) {
            if (index === columnCount) { // 找到自己的时候直接跳过
                continue;
            }
            else {
                tempPearsonCoefficientArr.push(pearsonCoefficient(objectArr, columns[columnCount], column[index]))
            }
        }
        pearsonCoefficientArr.push(indexOfAbsMax(tempPearsonCoefficientArr)) // 添加的是索引

    }
    return pearsonCoefficientArr
}

/**
 * 
 * @param {*} arr 需要寻找最大值的数组
 * @returns 该数组绝对值最大值的索引 和 对应的值
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
    return { index: maxIndex, coefficient: arr[maxIndex] };
}



export default hotDecking;