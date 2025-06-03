import express from "express";
import { contact, deleteContact, getAllContact } from './../controllers/contact.controller.js';

const router = express.Router();

router.route("/contact").post(contact);
router.route("/get-all-contact").get(getAllContact);
router.route("/delete-contact").delete(deleteContact);

export default router;
