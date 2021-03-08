/**
 * 
 * @param {*} objectArr 待处理的对象数组
 * @param {*} column 需要验证为空的列
 * 
 * @return {*} 处理过后的数组对象
 */
const deleteNull = (objectArr, column) => {
    const indexes = [] // 存储存在为空数值的索引
    objectArr.filter((value, index) => {
        if (isNaN(value[column]) || !value[column]) {
            indexes.push(index)
        }
    })
    indexes.forEach(value => {
        objectArr.splice(value, 1);
    })
    return objectArr
};

export default deleteNull;