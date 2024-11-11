const parseBoolean = (value) => {
    if (value === "true") return true;
    if (value === "false") return false;
    return undefined;
};

const parseType = (type) => {
    const isString = typeof type ==="string";
    if (!isString) return;
    const validTypes = ["work", "home", "personal"];
    return validTypes.includes(type) ? type: undefined;
};

export const parseContactFilterParams = (query) => {
    const {type, isFavourite} = query;

    const parsedType = parseType(type);
    const parsedIsFavourite = parseBoolean(isFavourite);

    return {
        type: parsedType,
        isFavourite: parsedIsFavourite,
    };
};
