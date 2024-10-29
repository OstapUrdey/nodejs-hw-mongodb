import 'dotenv/config';

export const env = (name, defaultVallue) => {
    const vallue = process.env[name];

    if (vallue) return vallue;

    if(defaultVallue) return defaultVallue;

    throw new Error(`Missing process.env[${name}]`);
}
