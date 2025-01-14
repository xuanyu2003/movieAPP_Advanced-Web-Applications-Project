import { pool } from "../helpers/db.js"

const selectAllGroups = async () => {
    return pool.query(`
        SELECT
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id,
            usergroup.group_introduction
        FROM 
            usergroup
        `)
}

const createGroup = async (group_users_id, group_name, group_owner_id,group_introduction) => {
    return pool.query("INSERT INTO usergroup (group_users_id, group_name, group_owner_id,group_introduction) VALUES ($1, $2, $3,$4) RETURNING *",
        [group_users_id, group_name, group_owner_id,group_introduction]
    )
}

const selectGroupById = async (groupId) => {
    const query = `
        SELECT 
            usergroup.group_id,
            usergroup.group_name,
            usergroup.group_owner_id,
            usergroup.group_users_id,
            usergroup.group_introduction,
            users.users_email AS group_owner_email  -- Add this line to fetch the owner's email
        FROM 
            usergroup
        LEFT JOIN 
            users ON usergroup.group_owner_id = users.users_id
        WHERE 
            group_id = $1;
    `;
    const values = [groupId];
    return pool.query(query, values);
}

const selectGroupMovies = async (groupId) => {
    return pool.query(`
        SELECT
            movie.movie_id,
            movie.movie_title,
            movie.movie_description,
            movie.movie_image
        FROM
            groupmovie
        INNER JOIN
            movie ON groupmovie.groupmovie_movie_id = movie.movie_id
        WHERE
            groupmovie.groupmovie_group_id = $1;
    `, [groupId])
}

const addMovieToGroups = async (groupId, movieId) => {
    const checkQuery = `
    SELECT 1 FROM groupmovie 
    WHERE groupmovie_group_id = $1 AND groupmovie_movie_id = $2;
    `;
    const exists = await pool.query(checkQuery, [groupId, movieId]);
        if (exists.rows.length) {
            return { rows: []}; 
        }
    
    return await pool.query(`
        INSERT INTO groupmovie (groupmovie_group_id, groupmovie_movie_id)
        VALUES ($1, $2)
        RETURNING *;
        `, [groupId, movieId])
}

const addMovieReviewToGroups = async (groupId, movieId, userId, review) => {
    return await pool.query(`
        INSERT INTO groupmoviereview (groupmoviereview_group_id, groupmoviereview_movie_id, groupmoviereview_users_id, groupmoviereview_review)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `, [groupId, movieId, userId, review])
};

const selectGroupMovieReviews = async (groupId) => {

    // first get all the movies in the group
    const movies = await pool.query(`
        SELECT
            movie.movie_id
        FROM
            groupmovie
        INNER JOIN
            movie ON groupmovie.groupmovie_movie_id = movie.movie_id
        WHERE
            groupmovie.groupmovie_group_id = $1;
    `, [groupId]);

    console.log('all movies in group', movies.rows);

    // then get all the reviews for each movie if exists in groupmoviereview table
    const reviews = await Promise.all(movies.rows.map(async (movie) => {
        const result = await pool.query(`
            SELECT
                groupmoviereview.groupmoviereview_id,
                groupmoviereview.groupmoviereview_movie_id,
                groupmoviereview.groupmoviereview_review,
                users.users_email AS groupmoviereview_user
            FROM
                groupmoviereview
            INNER JOIN USERS ON groupmoviereview.groupmoviereview_users_id = users.users_id
            WHERE
                groupmoviereview.groupmoviereview_movie_id = $1 and groupmoviereview.groupmoviereview_group_id = $2;
        `, [movie.movie_id, groupId]);
        return result.rows;
    }));


    // return all the reviews in a flat array
    return reviews;
};


export { selectAllGroups, createGroup, selectGroupById, selectGroupMovies, addMovieToGroups, addMovieReviewToGroups, selectGroupMovieReviews };
