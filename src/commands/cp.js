import {
    join,
    basename,
    isAbsolute,
    resolve
} from 'path';
import { createReadStream, createWriteStream } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";
const { cwd } = process;

export const cp = async (args) => {
    // todo: re-check, no permissions if C disk
    const paths = args.split(' ');
    const fileName = basename(paths[0]);
    const pathToFileCopy =
        isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

    const pathToDirectory =
        isAbsolute(paths[1]) ? join(paths[1], fileName) : resolve(cwd(), paths[1], fileName);

    const readStream = await createReadStream(pathToFileCopy);
    const writeStream = await createWriteStream(pathToDirectory);

    readStream.on('error', () => console.error(OPERATION_FAILED_ERR));
    writeStream.on('error', () => console.error(OPERATION_FAILED_ERR));

    await readStream
        .pipe(writeStream)
        .on('error', () => console.error(OPERATION_FAILED_ERR));

    showCurrentDir();
};
