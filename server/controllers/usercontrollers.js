import { insertUser, selectUserByEmail, selectUserById } from "../models/User";
import { ApiError } from "../helper/ApiError.js";

const postRegisteration = async (req, res, next) => {
    try {
        if (!req.body.email || req.body.email.length === 0) {
            return next(new ApiError('Invalid Email for user', 400));
        }
        if (!req.body.password || req.body.password.length < 8) {
            return next(new ApiError('Invalid Password for user', 400));
        }
        const userFromDb = await insertUser(req.body.email, req.body.password);
        const user = userFromDb.rows[0];
        return res.status(201).json(createUserObject(user.users_id, user.users_email));  
    } catch (error) {
        return next(error);
    }
}

const createUserObject = (id, email) => {
    return {
        'id': id,
        'email': email
    };
}

const postLogin = async (req, res, next) => {
    const invalid_credentials_message = "Invalid Credentials";
    try {
        const userFromDb = await selectUserByEmail(req.body.email);
        if (userFromDb.rowCount === 0) {
            return next(new ApiError(invalid_credentials_message, 401));
        }

        const user = userFromDb.rows[0];
        if (req.body.password !== user.users_password) {  
            return next(new ApiError(invalid_credentials_message, 401));
        }

        return res.status(200).json(createUserObject(user.users_id, user.users_email));  
    } catch (error) {
        return next(error);
    }
}

export { postRegisteration, createUserObject };
