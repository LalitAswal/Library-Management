import express from 'express';
const router = express.Router();

router.get("/",login)
router.post("/",createAccount)
router.get("/",adminLogin)
router.put("/:id",deleteUser)



export default router;

