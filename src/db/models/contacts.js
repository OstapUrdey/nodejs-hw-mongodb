import { Schema, model } from 'mongoose';

const contactsSchema = new Schema({

    name: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        default: null,
    },
    isFavourite: {
        type: Boolean,
        default: false,
    },
    contactType: {
        type: String,
        enum: ["work", "home", "personal"],
        default: "personal",
        required: true,
    }
}, {timestamps: true, versionKey: false});

const ContactsCollection = model("Contact", contactsSchema);

export default ContactsCollection;
