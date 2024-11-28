import {model, Schema} from 'mongoose';
import { emailRegexp } from '../../constants/index.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const usersSchema = new Schema({
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match: emailRegexp,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
    }, {timestamps: true, versionKey: false},
);

usersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

usersSchema.post("save", handleSaveError);

usersSchema.pre("findOneAndUpdate", setUpdateSettings);

usersSchema.post("findOneAndUpdate", handleSaveError);

export const UserCollection = model("users", usersSchema);
