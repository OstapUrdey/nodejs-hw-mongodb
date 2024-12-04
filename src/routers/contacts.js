import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get("/", ctrlWrapper(contactControllers.getContactsController));

router.get("/:id", isValidId, ctrlWrapper(contactControllers.getContactsByIdController));

router.post("/", isValidId, upload.single("photo"), validateBody(createContactSchema), ctrlWrapper(contactControllers.createContactController));

router.put("/:id", isValidId, upload.single("photo"), validateBody(createContactSchema), ctrlWrapper(contactControllers.upsertContactController));

router.patch("/:id", isValidId, upload.single("photo"), validateBody(updateContactSchema), ctrlWrapper(contactControllers.patchContactController));

router.delete("/:id", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default router;
