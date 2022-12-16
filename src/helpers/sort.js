// todo: re-check
export const sortByName = (prev, next) => {
    if (next.Name > prev.Name) {
        return -1;
    }

    return 1;
};

export const sortByType = (prev, next) => {
    if (prev.Type === 'directory' && next.Type === 'file') {
        return -1;
    }

    return 1;
};
