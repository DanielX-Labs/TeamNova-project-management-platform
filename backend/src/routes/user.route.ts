import { Router } from "express";
import { getCurrentUserController, updateProfileController } from "../controllers/user.controller";

const userRoutes = Router();

userRoutes.get("/current", getCurrentUserController);
userRoutes.put("/profile", updateProfileController);

export default userRoutes;
