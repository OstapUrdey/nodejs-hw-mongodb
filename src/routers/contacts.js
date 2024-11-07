import { Router } from 'express';
import * as contactControllers from '../controllers/contacts.js';
import {ctrlWrapper} from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { createContactSchema, updateContactSchema } from '../validation/contacts.js';
import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.get("/", ctrlWrapper(contactControllers.getContactsController));

contactsRouter.get("/:id", isValidId, ctrlWrapper(contactControllers.getContactsByIdController));

contactsRouter.post("/", validateBody(createContactSchema), ctrlWrapper(contactControllers.createContactController));

contactsRouter.put("/:id", isValidId, validateBody(createContactSchema), ctrlWrapper(contactControllers.upsertContactController));

contactsRouter.patch("/:id", isValidId, validateBody(updateContactSchema), ctrlWrapper(contactControllers.patchContactController));

contactsRouter.delete("/:id", isValidId, ctrlWrapper(contactControllers.deleteContactController));

export default contactsRouter;
