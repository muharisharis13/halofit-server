class paging{
    getPagination = (page,size)=>{
        const limit = size ? +size : 3;
        const offset = page ?(page - 1) * limit : 0;

        return {limit , offset}
    }

    getPagingData = (dataParam, page, limit) => {
        const {count: totalItems, rows:result} = dataParam
        const currentPage = page? +page : 0;
        const totalPages = Math.ceil(totalItems / limit);
        return {result,totalItems,totalPages,currentPage};
    }
}

module.exports = new paging();