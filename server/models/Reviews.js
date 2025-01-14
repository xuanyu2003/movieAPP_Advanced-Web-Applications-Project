import { pool } from "../helpers/db.js"

const selectAllReviews = async () => {
    return await pool.query(`
        SELECT 
            review_users_email,
            review_movie_id,
            review_text,
            review_rating,
            review_created_at
        FROM review;
    `)
}

const selectReviewByMovieId = async (id) => {
    return await pool.query (`
        SELECT 
            review_users_email,
            review_movie_id,
            review_text,
            review_rating,
            review_created_at
        FROM 
            review
        WHERE
            review_movie_id = $1;
        `, [id]);
}
const insertReview = async (user_id, user_email, movie_id, review, review_rating) => {
    return await pool.query(`
        INSERT INTO review (review_users_id, review_users_email, review_movie_id, review_text, review_rating, review_created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING *;
        `, [user_id, user_email, movie_id, review, review_rating])
}

export { selectAllReviews, insertReview, selectReviewByMovieId }