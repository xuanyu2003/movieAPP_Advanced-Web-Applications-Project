// This function returns an empty array when a column in the database is empty
const emptyOrRows = (result) => {
    if (!result) return []
    return result.rows
}

export { emptyOrRows }