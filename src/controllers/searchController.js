import applicationDB from '../models/index'
import searchService from '../services/searchService'


const handleSearch = async (req, res) => {
    try {
        let type = req.query.type
        let data = req.query.data
        let result = await searchService.getSearchData(data, type)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error Server'
        })
    }
}

module.exports = {
    handleSearch,
}