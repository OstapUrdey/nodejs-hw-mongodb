import 'dotenv/config';

export const env = (name, defaultVallue) => {
    const value = process.env[name];

    if (value) return value;

    if(defaultVallue) return defaultVallue;

    throw new Error(`Missing process.env[${name}]`);
}
