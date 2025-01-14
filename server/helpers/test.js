import fs from "fs"
import path from "path"
import { pool } from "./db.js"
import { fileURLToPath } from 'url'
import { dirname } from 'path'
import { hash } from "bcrypt"
import dotenv from "dotenv"

dotenv.config()


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const initializeTestDb = async () => {
    const sql = fs.readFileSync(path.resolve(__dirname, "../test.sql"), "utf8");
    await pool.query(sql)

}

const insertTestUser = async (email, password) => {
    
    const hashedPassword = await hash(password, 10);
        await pool.query("insert into users (users_email, users_password) values ($1, $2)",
            [email, hashedPassword])
}

const insertTestReview = async (user_id, review_users_email, review_movie_id, review_text, review_rating) => {
    await pool.query(`
        INSERT INTO review (review_users_id, review_users_email, review_movie_id, review_text, review_rating, review_created_at)
        VALUES ($1, $2, $3, $4, $5, CURRENT_TIMESTAMP)
        RETURNING *;
        `, [user_id, review_users_email, review_movie_id, review_text, review_rating])
}

const insertTestFavorite = async (favorite_users_id, favorite_movie_id) => {
    await pool.query(`
        INSERT INTO 
            favorite (favorite_users_id, favorite_movie_id, favorite_added_at)
        VALUES 
            ($1, $2, CURRENT_TIMESTAMP);
    `, [favorite_users_id, favorite_movie_id])
}

const insertTestSharedfavorite = async (shared_favorite_movie_id, favorite_users_id, shared_favorite_id) => {
    await pool.query(`
        INSERT INTO 
            sharedfavorite (shared_favorite_movie_id, favorite_users_id, shared_favorite_id)
        VALUES 
            ($1, $2, $3);
        `, [shared_favorite_movie_id, favorite_users_id, shared_favorite_id])
}

const insertTestUsergroup = async (group_users_id, group_name, group_owner_id) => {
    await pool.query(`
        INSERT INTO 
            usergroup (group_users_id, group_name, group_owner_id)
        VALUES
            ($1, $2, $3);
        `, [group_users_id, group_name, group_owner_id]) 
}

const insertTestGroupmember = async (groupmember_group_id, groupmember_users_id, groupmember_status) => {
    await pool.query(`
        INSERT INTO 
            groupmember (groupmember_group_id, groupmember_users_id, groupmember_status)
        VALUES 
            ($1, $2, $3);
        `, [groupmember_group_id, groupmember_users_id, groupmember_status])
}

export { initializeTestDb, insertTestUser, insertTestReview, insertTestFavorite, insertTestSharedfavorite, insertTestUsergroup, insertTestGroupmember }