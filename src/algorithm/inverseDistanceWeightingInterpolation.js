/**
 * 
 * @param {*} objectArr 待处理的对象数组
 * @param {*} column 需要验证为空的列
 * 
 * @return {*} 处理过后的数组对象
 */
const inverseDistanceWeightingInterpolation = (objectArr, column) => {
    const indexes = [] // 存储存在为空数值的索引
    objectArr.filter((value, index) => {
        if (!parseInt(value[column]) || !parseFloat(value[column])) {
            indexes.push(index)
        }
    })
    indexes.forEach(nullIndex => {
        let molecular = 0
        let denominator = 0
        for (let i = 0; i < objectArr.length; i++) {
            if (indexes.indexOf(i) === -1) { // 如果当前这个不是缺失值
                molecular += parseFloat(objectArr[i][column]) / Math.abs(nullIndex - i)
                denominator += 1 / Math.abs(nullIndex - i)
            }
        }
        objectArr[nullIndex][column] = molecular / denominator
    })
    return objectArr
};

export default inverseDistanceWeightingInterpolation