function Features(query, queryStr) {
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
      const excludedFields = ['page', 'sort', 'limit', 'keyword'];
      let filterQuery = { ...queryStr };
      excludedFields.forEach((field) => delete filterQuery[field]);
  
      const result = await query.find(filterQuery);
      return result;
    };
  
    return { search: search, filter: filter };
  }
  
  export default Features;
  