/**
 * delete empty row of a data array
 * @param {Array} objectArr the origin data
 * @param {String} column the aim column name
 * @return {Array} the result data array
 */
const deleteNull = (objectArr, column) => {
    const indexes = []
    objectArr.filter((value, index) => {
        if (isNaN(value[column]) || !value[column]) {
            indexes.push(index)
        }
        return ''
    })
    indexes.forEach((value, index) => {
        objectArr.splice(value - index, 1);
    })
    return objectArr
};

export default deleteNull;