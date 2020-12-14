/**
 * 侦测哪一列有可能是时间序列信息
 * @param {String Array} columnNameArray 由所有列名组成的数组
 * @return {Object} 返回可能是时间序列数据那一列的索引信息
 */
export default timeFinder = (columnNameArray) => {
    /**
     * 常见时间格式
     * 
     * 日期/月份/年  份
     * 日期-月份-年  份
     * 年  份-月份-日期
     * 年  份/月份/日期
     * 月份-年  份
     * 月份/年  份
     * 年  份-月份
     * 年  份/月份
     * 年  份月份日期
     * 年  份月份
     * 
     * 因为 小时,分钟,秒钟 一般都是跟在后面的, 这里只需要判断最前面的部分是不是一个类
     * 时间格式的样式就可以了,这里不会特意去检测时间数据是否有错误
     */
    const timePatternArr = [
        /^\d{1,2}[/-]\d{1,2}[/-]\d{4}/,
        /^\d{4}[/-]\d{1,2}[/-]\d{1,2}/,
        /^\d{1,2}[/-]\d{4}/,
        /^\d{4}[/-]\d{1,2}/,
        /^\d{6,8}/
    ]

    for (let columnNameIndex = 0; columnNameIndex < columnNameArray.length; columnNameIndex++){
        for(let timePattern of timePatternArr){
            if(columnNameArray[columnNameIndex].match(timePattern)){
                return {
                    'columnNameIndex':columnNameIndex
                }
            }
        }
    }
    return {
        'columnNameIndex':-1
    }

}