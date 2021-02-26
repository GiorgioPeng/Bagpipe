import * as d3 from "d3";
// import DataFrame from "dataframe-js";

/**
 * 读取文件中数据并更新state
 * @param {file} csvFile 
 * @param {function} updateState 参数为需要更新的字段名和值
 */
const dataReader = (csvFile,updateState)=>{
    try{
        const fileReader = new FileReader()
        const charset = 'utf-8'
        fileReader.readAsText(csvFile, charset)
        fileReader.addEventListener("load", ()=>{
            const data = d3.csvParseRows(fileReader.result, function (d) {
                return d;
            });
            const data4Analyse = (d3.csvParse(fileReader.result, function (d) {
                return d;
            }))
            console.log(data)
            // const dataCopy = Object.create(data)
            // let dataFrame = new DataFrame(dataCopy.splice(1),dataCopy[0])
            // // dataFrame.show()
            // console.log(dataFrame)
            // updateState('data',dataFrame)
            updateState('data',data)
            updateState('data4Analyse',data4Analyse)
        });
    }
    catch(e){
        console.log(e)
    }

}
export default dataReader