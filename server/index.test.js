import { 
        initializeTestDb, 
        insertTestReview, 
        insertTestUser, 
        insertTestFavorite, 
        insertTestSharedfavorite, 
        insertTestUsergroup, 
        insertTestGroupmember} 
from "./helpers/test.js";

import { expect } from "chai";
import { response } from "express";

const base_url = "http://localhost:3001"

describe("POST login" , () => {
    before(async() => {
        initializeTestDb()
    })
     it ("should login with valid credentials", async() => {
        const email = "validlog@gmail.com"
        const password = "A1234567"

        await insertTestUser(email, password);
        
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(200, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("users_id", "users_email", "accessToken", "refreshToken")
    })

    

    it ("should not login with invalid credentials", async () => {
        const email = "wrongpasslog@gmail.com"
        const password = "A1234567"
        const wrongPassword = "notthepassword"
        await insertTestUser(email, password)
        
        const response = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": wrongPassword})
        })
        const data = await response.json()

        expect(response.status).to.equal(401, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    })
})

describe("POST register", () => {

    it ("should register with valid email and password", async() => {
        const email = "validreg@gmail.com"
        const password = "A1234567"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(201, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("users_id", "users_email")
    })

    it ("should not register with less than 8 character password", async () => {
        const email = "lengthreg@gmail.com"
        const password = "Short"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(400, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
        expect(data.error).to.equal("Invalid email or password.");
    })

    it ("should not register with a otherwise valid password that does not contain a capitalized letter", async () => {
        const email = "capitalletterreg@gmail.com"
        const password ="a1234567"
        const response = await fetch(base_url + "/user/register", {
            method: "post",
            headers: {
                "Content-Type":"application/json"
            },
            body: JSON.stringify({"users_email":email, "users_password": password})
        })
        const data = await response.json()
        expect(response.status).to.equal(400, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
    })
})

describe ("POST logout", () => {

    it("should succesfully logout user", async () => {
        const email = "logout@gmail.com"
        const password = "A1234567"
        await insertTestUser(email, password)

        const loginResponse = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })

        expect(loginResponse.status).to.equal(200)

        const loginData = await loginResponse.json()
        const { refreshToken, accessToken } = loginData

        expect(refreshToken).to.exist
        expect(accessToken).to.exist

        const logoutResponse = await fetch (base_url + "/user/logout", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ token: refreshToken })
        })
        const data = await logoutResponse.json();
        expect(logoutResponse.status).to.equal(200, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("message")
        expect(data.message).to.equal("You logged out successfully!");
    })

    it("should not logout user", async () => {
        const email = "wronglogout@gmail.com"
        const password = "A1234567"
        const wrongRefreshToken = ""
        await insertTestUser(email, password)

        const loginResponse = await fetch (base_url + "/user/login", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                
            },
            body: JSON.stringify({"users_email": email, "users_password": password})
        })

        expect(loginResponse.status).to.equal(200)

        const loginData = await loginResponse.json()
        const { accessToken } = loginData

        expect(accessToken).to.exist

        const logoutResponse = await fetch (base_url + "/user/logout", {
            method: "post",
            headers: {
                "Content-Type":"application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({ token: wrongRefreshToken })
        })
        const data = await logoutResponse.json();
        expect(logoutResponse.status).to.equal(403, data.error)
        expect(data).to.be.an("object")
        expect(data).to.include.all.keys("error")
        expect(data.error).to.equal("Refresh token is not valid or already logged out.");
    })
})

describe("GET reviews", () => {

    it ("should get all reviews if review column is empty", async () => {

        const response = await fetch(base_url + "/reviews")
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array")
        data.forEach((review) => {
            expect(review).to.be.an("object");
            expect(review).to.include.all.keys(
                "review_created_at",
                "review_users_email",
                "review_movie_id",
                "review_text",
                "review_rating"
            );
        });
    })

    it ("should get all reviews if review column is not empty", async () => {
        const review_users_id = 1
        const review_users_email = "testreview@gmail.com"
        const review_movie_id = 1142
        const review_text = "it was epic"
        const review_rating = 4

        const review_users_id2 = 1
        const review_users_email2 = "testreview2@gmail.com"
        const review_movie_id2 = 1143
        const review_text2 = "it was epic2"
        const review_rating2 = 3

        await insertTestReview(review_users_id, review_users_email, review_movie_id, review_text, review_rating)
        await insertTestReview(review_users_id2, review_users_email2, review_movie_id2, review_text2, review_rating2)

        const response = await fetch(base_url + "/reviews")
        const data = await response.json()
        expect(response.status).to.equal(200)
        expect(data).to.be.an("array").that.is.not.empty
        data.forEach((review) => {
            expect(review).to.be.an("object");
            expect(review).to.include.all.keys(
                "review_created_at",
                "review_users_email",
                "review_movie_id",
                "review_text",
                "review_rating"
            );
        });
    })

})

// delete test goest here sometime when it is completed, it was hard to to before it

// describe("DELETE user", () => {
//     it ("should delete all user data", async () => {
//         const email = "deletethis@gmail.com"
//         const password = "A1234567"

//         const review_users_id = 1
//         const review_users_email = "testreview@gmail.com"
//         const review_movie_id = 1142
//         const review_text = "it was epic"
//         const review_rating = 4

//         const favorite_users_id = 1 
//         const favorite_movie_id = 1142


//         const shared_favorite_movie_id = 1142
//         const shared_favorite_id = 1

//         const group_users_id = 1 
//         const group_name = "madness" 
//         const group_owner_id = 1

//         const groupmember_group_id = 1
//         const groupmember_users_id = 1 
//         const groupmember_status = "active"
//         insertTestUser(email, password)
//         insertTestReview(review_users_id, review_users_email, review_movie_id, review_text, review_rating)
//         insertTestFavorite(favorite_users_id, favorite_movie_id)
//         insertTestSharedfavorite(shared_favorite_movie_id,favorite_users_id, shared_favorite_id)
//         insertTestUsergroup(group_users_id, group_name, group_owner_id)
//         insertTestGroupmember(groupmember_group_id, groupmember_users_id, groupmember_status)

//     })
// })


