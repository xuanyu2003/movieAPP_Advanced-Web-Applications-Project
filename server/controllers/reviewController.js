import { selectAllReviews, insertReview, selectReviewByMovieId } from "../models/Reviews.js"
import { emptyOrRows} from "../helpers/emptyOrRows.js"
 
const getReviews = async (req, res, next) => {
    try {
        const result = await selectAllReviews()
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

const postReview = async (req, res, next) => {
    try {
        const { user_id, user_email, movie_id, review, review_rating } = req.body;

        if (req.user.users_id !== user_id) {
            return res.status(403).json({ message: "User ID does not match the token" });
        }
        const result = await insertReview(user_id, user_email, movie_id, review, review_rating)
        return res.status(200).json().send()
    } catch (error) {
        return next(error)
    }
}

const getReview = async (req, res, next) => {
    try {
        const {movie_id} = req.query
        const result = await selectReviewByMovieId(movie_id)
        return res.status(200).json(emptyOrRows(result))
    } catch (error) {
        return next(error)
    }
}

export { getReviews, postReview, getReview }