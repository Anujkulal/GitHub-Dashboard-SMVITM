import express from "express"
import { adminLoginController, updateAdminLoggedInPasswordController, userLogoutController } from "../controllers/userController.js";
import { authenticate, roleOnly } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/admin/login", adminLoginController)
router.put("/admin/password", authenticate, roleOnly("Admin"), updateAdminLoggedInPasswordController)
router.post("/logout", userLogoutController)

export default router;