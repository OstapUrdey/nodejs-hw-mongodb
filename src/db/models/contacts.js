import { Schema, model, mongoose } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';

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
        match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
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
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    photo: {type: String},
}, {timestamps: true, versionKey: false});

contactsSchema.post("save", handleSaveError);

contactsSchema.pre("findOneAndUpdate", setUpdateSettings);

contactsSchema.post("findOneAndUpdate", handleSaveError);

const ContactsCollection = mongoose.model("Contact", contactsSchema);

export default ContactsCollection;
