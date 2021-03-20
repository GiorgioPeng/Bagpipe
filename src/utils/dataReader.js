import * as d3 from "d3";
// import DataFrame from "dataframe-js";

/**
 * load the uploaded data and update thte globale state
 * @param {file} csvFile the uploaded file
 * @param {function} updateState the update state function
 */
const dataReader = (csvFile, updateState) => {
    try {
        const fileReader = new FileReader()
        const charset = 'utf-8'
        fileReader.readAsText(csvFile, charset)
        fileReader.addEventListener("load", () => {
            let data4Analyse = (d3.csvParse(fileReader.result, function (d) {
                return d;
            }))
            updateState('column', data4Analyse.columns)
            updateState('data4Analyse', data4Analyse)
        });
    }
    catch (e) {
        console.log(e)
    }

}
export default dataReader