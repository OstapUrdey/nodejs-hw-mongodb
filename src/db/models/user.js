import {model, Schema} from 'mongoose';
import { emailRegexp, ROLES } from '../../constants/index.js';

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
        role: {
            type: String,
            enum: [ROLES.ADMIN, ROLES.GUEST],
            default: ROLES.GUEST,
        },
    }, {timestamps: true, versionKey: false},
);

usersSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

export const UserCollection = model("users", usersSchema);
