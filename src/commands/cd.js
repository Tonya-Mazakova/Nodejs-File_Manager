import { resolve, isAbsolute } from 'path';
import { showCurrentDir, getPath } from "../helpers/index.js";
const { chdir } = process;

export const cd = async (path) => {
    let pathFormatted = path;

    if (path?.length === 1) {
        pathFormatted = `${path}:\\`;
    }

    if ((path?.length === 2 && path[1] === ":")) {
        pathFormatted = `${path}\\`;
    }

    await chdir(getPath(pathFormatted));
    showCurrentDir();
};
