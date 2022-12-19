import { resolve, isAbsolute } from 'path';
import { removeQuotes } from './removeQuotes.js';

export const getPath = (path) => {
    const formattedPath = removeQuotes(path);
    return isAbsolute(formattedPath) ? formattedPath : resolve(process.cwd(), formattedPath);
};
