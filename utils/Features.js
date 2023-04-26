const Features = (query, queryStr) => {
    const search = async () => {
      const keyword = queryStr.keyword
        ? {
            name: {
              $regex: queryStr.keyword,
              $options: "i",
            },
          }
        : {};
      const result = await query.find({ ...keyword });
      return result;
    };
  
    const filter = async () => {
      const excludedFields = ["page", "sort", "limit", "keyword"];
      let filterQuery = { ...queryStr };
      excludedFields.forEach((field) => delete filterQuery[field]);
  
      const result = await query.find(filterQuery);
      return result;
    };
  
    const paginate = async (results) => {
      const page = parseInt(queryStr.page) || 1;
      const limit = parseInt(queryStr.limit) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
  
      const total = results.length;
      const pagination = {
        currentPage: page,
        perPage: limit,
        total,
        totalPages: Math.ceil(total / limit),
      };
  
      const paginatedResults = results.slice(startIndex, endIndex);
  
      return { pagination, results: paginatedResults };
    };
  
    return { search, filter, paginate };
  };
  
  export default Features;