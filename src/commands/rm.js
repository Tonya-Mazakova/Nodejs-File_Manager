import { rm as remove } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";

export const rm = async (path) => {
    await remove(path, (err) => { if (err) console.error(err) });
    showCurrentDir();
};
