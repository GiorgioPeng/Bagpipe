import * as d3 from "d3";
// import DataFrame from "dataframe-js";

/**
 * 读取文件中数据并更新state
 * @param {file} csvFile 
 * @param {function} updateState 参数为需要更新的字段名和值
 */
const dataReader = (csvFile, updateState) => {
    try {
        const fileReader = new FileReader()
        const charset = 'utf-8'
        fileReader.readAsText(csvFile, charset)
        fileReader.addEventListener("load", () => {
            const data = d3.csvParseRows(fileReader.result, function (d) {
                return d;
            });
            let data4Analyse = (d3.csvParse(fileReader.result, function (d) {
                return d;
            }))
            console.log(data)
            // data4Analyse = linearInterpolation(data4Analyse, 'value1')
            // data4Analyse = linearInterpolation(data4Analyse, 'value2')
            // console.log(data4Analyse)
            updateState('data', data)
            updateState('data4Analyse', data4Analyse)
        });
    }
    catch (e) {
        console.log(e)
    }

}
export default dataReader