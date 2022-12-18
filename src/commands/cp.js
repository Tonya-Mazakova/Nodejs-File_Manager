import {
    join,
    basename,
    isAbsolute,
    resolve
} from 'path';
import { createReadStream, createWriteStream, stat } from 'node:fs';
import {
    showCurrentDir,
    getPath,
    removeQuotes
} from "../helpers/index.js";
import { OPERATION_FAILED_ERR, INVALID_INPUT } from "../constants.js";
const { cwd } = process;

export const cp = async (args) => {
    const paths = args.split(' ');
    const pathToFile = removeQuotes(paths[0]);
    const pathToDirectory = removeQuotes(paths[1]);
    const fileName = basename(pathToFile);

    await stat(pathToFile, (err, stats) => {
        if(err || !stats.isFile()) {
           console.log(INVALID_INPUT);
        }
    });

    await stat(pathToDirectory, (err, stats) => {
        if (!stats || !stats?.isDirectory()) {
            console.log(INVALID_INPUT);
        }
    });

    const pathToFileCopy = getPath(pathToFile);

    const pathToDirectoryCopy =
        isAbsolute(pathToDirectory) ?
            join(pathToDirectory, fileName) : resolve(cwd(), pathToDirectory, fileName);

    const readStream = await createReadStream(pathToFileCopy);
    const writeStream = await createWriteStream(pathToDirectoryCopy);

    await readStream.on('error', () => {
        //console.error(OPERATION_FAILED_ERR)
    });
    await writeStream.on('error', () => {
        //console.error(OPERATION_FAILED_ERR)
    });

    await readStream
        .pipe(writeStream)
        .on('error', () => console.error(OPERATION_FAILED_ERR));

    showCurrentDir();
};
