import { resolve } from 'path';
import { showCurrentDir } from '../helpers/index.js';
const { chdir, cwd } = process;

export const up = async () => {
    const newPath = await resolve(cwd(), '../');
    await chdir(newPath);

    showCurrentDir();
};
