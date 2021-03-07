/**
 * 
 * @param {*} objectArr 一个对象数组
 * @param {*} column 需要补全的字段
 */
const linearInterpolation = (objectArr, column) => {
    const indexes = [] // 存储所有存在空值的索引
    const nearIndexes = [] // 存储缺失值前后的索引的对象数组
    objectArr.filter((value, index) => {
        if (!parseInt(value[column]) || !parseFloat(value[column])) {
            indexes.push(index)
            const tempIndex = {} // 临时存放前后两个变量索引的对象
            for (let i = index - 1; i >= 0; i--) {
                if (!parseInt(objectArr[i][column]) || !parseFloat(objectArr[i][column])) {// 找到了前一个存在值的索引
                    tempIndex.last = i
                    break
                }
            }

            for (let i = index + 1; i < objectArr.length; i++) {
                if (!parseInt(objectArr[i][column]) || !parseFloat(objectArr[i][column])) {// 找到了后一个存在值的索引
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
            // console.log(objectArr[indexes[i]][column])
            // console.log(indexes[i])
            objectArr[indexes[i]][column] = coreAlgorithm(
                indexes[i],
                parseInt(nearIndexes[i]['last']),
                parseInt(nearIndexes[i]['next']),
                parseFloat(objectArr[nearIndexes[i]['last']][column]),
                parseFloat(objectArr[nearIndexes[i]['next']][column])
            )
        }
    }
    // console.log(objectArr)
    return objectArr
}

/**
 * 
 * @param {*} index 需要补全的变量的索引
 * @param {*} indexA 需要补全的变量的最近的上一个有值的索引
 * @param {*} indexB 需要补全的变量的最近的下一个有值的索引
 * @param {*} valueA 需要补全的变量的最近的上一个的值
 * @param {*} valueB 需要补全的变量的最近的下一个的值
 * @returns 返回应该补全的值
 */

const coreAlgorithm = (index, indexA, indexB, valueA, valueB) => {
    // console.log(index, indexA, indexB, valueA, valueB)
    return ((valueB - valueA) / (indexB - indexA)) * (index - indexA) + valueA
}
export default linearInterpolation