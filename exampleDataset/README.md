<img src="https://ch-resources.oss-cn-shanghai.aliyuncs.com/images/lang-icons/icon128px.png" width="22px" /> English | [简体中文](./README.zh-CN.md)

# How to construct the dataset file
1. At first, you should ensure the filetype of the dataset is 'csv'
2. The dataset must have a column which is used to indicate the timestamp
3. Other column must be numerical type. (Like int, float and so on. Because I do not have enough time to finish the functionality of other data type)

------------------------------------------------  

like this one, the age is the timestamp of the dataset, and the money is a variable which may depende on the age.
|age|money|
|:---:|:---:|
|10|20000000|
|15|30000000|
|20|28000000|
|30|20000700|
|35|40000000|
|50|9000000|

# Example Dataset
In addition, I have provided some sample data sets in the directory.
1. **Tesla.csv** the stock data of tesla (come from Kaggle)
2. **steamData.csv** the count of user in the steam game platform (from steam game platform)