import { resolve } from 'path';
import { showCurrentDir } from '../helpers/index.js';
import { INVALID_INPUT } from "../constants.js";
const { chdir, cwd } = process;

export const up = async (args) => {
    if (args) {
        return console.error(INVALID_INPUT);
    }

    const newPath = await resolve(cwd(), '../');
    await chdir(newPath);

    showCurrentDir();
};
