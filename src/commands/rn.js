import { rename, stat } from 'node:fs';
import { showCurrentDir, getPath } from "../helpers/index.js";
import {
    basename,
    extname,
    join
} from 'path';

export const rn = async (args) => {
    const paths = args.split(' ');
    const pathToFile = getPath(paths[0]);
    const fileName = basename(paths[0]);
    const pathToDirectory = pathToFile.replace(fileName, '');

    await rename(pathToFile, join(pathToDirectory, paths[1]), (err) => {
        if (err) console.error(err);
    });

    showCurrentDir();
};
