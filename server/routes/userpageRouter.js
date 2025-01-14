import { Router } from "express";
import { pool } from "../helpers/db.js";

const router = Router(); 

router.get("/", async (req, res) => {
    try {
        const users_id = req.query.users_id; // Get users_id from query parameter

        // Get the favorite movies of the user
        const result = await pool.query(
            `SELECT movie.movie_id, movie.movie_title, movie.movie_description
            FROM favorite
            JOIN movie ON favorite.favorite_movie_id = movie.movie_id
            WHERE favorite.favorite_users_id = $1`, 
            [users_id]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "No favorite movies found" });
        }

        const favoriteMovies = result.rows; // Return all the favorite movies
        res.status(200).json(favoriteMovies); // Send all favorite movies as a response
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Server error" });
    }
});

export default router;
