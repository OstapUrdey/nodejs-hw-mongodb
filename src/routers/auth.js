import { Router } from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { authRegisterSchema } from '../validation/auth.js';
import { logoutUserController, refreshUsersSessionController, registerUserController } from '../controllers/auth.js';
import { validateBody} from '../middlewares/validateBody.js';
import { loginUserSchema } from '../validation/auth.js';
import { loginUserController } from '../controllers/auth.js';

const router = Router();

router.post("register", validateBody(authRegisterSchema), ctrlWrapper(registerUserController));

router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUsersSessionController));

export default router;
