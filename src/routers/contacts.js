import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';
import { aunthenticate } from '../middlewares/aunthenticate.js';
import { checkRoles } from '../middlewares/checkRoles.js';
import { ROLES } from '../constants/index.js';

const router = Router();

router.use(aunthenticate);

router.get("/", checkRoles(ROLES.ADMIN), ctrlWrapper(contactControllers.getContactsController));

router.get("/:id", checkRoles(ROLES.ADMIN, ROLES.GUEST), isValidId, ctrlWrapper(contactControllers.getContactsByIdController));

router.post("/", checkRoles(ROLES.ADMIN), validateBody(createContactSchema), ctrlWrapper(contactControllers.createContactController));

router.put("/:id", checkRoles(ROLES.ADMIN), isValidId, validateBody(createContactSchema), ctrlWrapper(contactControllers.upsertContactController));

router.patch("/:id", checkRoles(ROLES.ADMIN, ROLES.GUEST), isValidId, validateBody(updateContactSchema), ctrlWrapper(contactControllers.patchContactController));

router.delete("/:id", checkRoles(ROLES.ADMIN), isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default router;
