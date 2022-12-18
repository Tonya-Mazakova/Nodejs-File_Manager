import { resolve, isAbsolute } from 'path';
import { showCurrentDir, getPath } from "../helpers/index.js";
const { chdir } = process;

export const cd = async (path) => {
    await chdir(getPath(path));
    showCurrentDir();
};
