const fs = require('fs-extra')
const uniqid = require('uniqid')

const readJSON =  async (path) => {
    let  json= await fs.readJson(path)
    return json;
}

const writeJSON = async (path, data ,asin,  _id='') => {

    let jsonArray = await fs.readJson(path)
console.log(asin)
  if(_id!=='') {
      jsonArray = [...jsonArray, {...data, asin, _id, createdAt:new Date()}]
  }else{
      jsonArray = [...jsonArray, {...data, asin,   createdAt:new Date()}]
  }
    let write = await fs.writeJson(path, jsonArray)
    return jsonArray
}

const getByID = async(path, id) => {
        let jsonArray = await fs.readJson(path)
        const book = jsonArray.find((book) => book.asin === id);
        return book;
}

const getAllByQuery = async(path, key, value) => {
    let jsonArray = await fs.readJson(path)
    let filtered  = jsonArray.filter((item) =>
        item[key]==value);
        return filtered

}
const updateData = async(path, id, data) => {

    let  json=  await fs.readJson(path);

    const updatedData = json.map(
        (item) =>
            (item.asin === id && { ...data, asin: id }) || item
    );

    let write = await fs.writeJson(path, updatedData)
    return updatedData

}
const removeData = async (path, key,  value) => {
    let  json=  await fs.readJson(path);
    const filtered = json.filter((item) => item[key] !== value);
    const write = fs.writeJson(path, filtered)
    return filtered
}


module.exports = {readJSON, writeJSON, getByID, updateData, removeData, getAllByQuery}