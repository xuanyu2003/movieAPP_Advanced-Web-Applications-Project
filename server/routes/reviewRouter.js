import { Router } from "express"
import { getReview, getReviews, postReview } from "../controllers/reviewController.js"
import { verifyToken } from "../helpers/verifyToken.js"

const router = Router()

router.get("/", getReviews)
router.get("/review", getReview)
router.post("/create", verifyToken, postReview)
export default router