import { Router } from 'express';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { authRegisterSchema, requestResetEmailSchema, loginUserSchema, resetPasswordSchema } from '../validation/auth.js';
import { logoutUserController, loginUserController, refreshUsersSessionController, registerUserController, requestResetEmailController, resetPasswordController } from '../controllers/auth.js';
import { validateBody} from '../middlewares/validateBody.js';

const router = Router();

router.post("/register", validateBody(authRegisterSchema), ctrlWrapper(registerUserController));

router.post("/login", validateBody(loginUserSchema), ctrlWrapper(loginUserController));

router.post("/logout", ctrlWrapper(logoutUserController));

router.post("/refresh", ctrlWrapper(refreshUsersSessionController));

router.post("/send-reset-email", validateBody(requestResetEmailSchema), ctrlWrapper(requestResetEmailController));

router.post("/reset-pwd", validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));

export default router;
