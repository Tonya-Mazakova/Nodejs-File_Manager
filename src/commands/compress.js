import {
    resolve,
    isAbsolute,
    basename,
    extname,
    join
} from 'path';
import { createBrotliCompress } from 'node:zlib';
import { pipeline } from 'stream';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";
import { createReadStream, createWriteStream } from 'node:fs';
const { cwd } = process;

// todo: add error handling
export const compress = async (args) => {
    const paths = args.split(' ');
    const fileName = basename(paths[0]);
    const fileNameDestExt = basename(paths[1]) && extname(basename(paths[1]));
    const fileNameDest = fileNameDestExt ? '' : `${fileName}.br`;

    const pathToFile =
        isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

    const pathToDirectory =
        isAbsolute(paths[1])
            ? join(paths[1], fileNameDest)
            : resolve(cwd(), resolve(paths[1], fileNameDest));

    const readStream = createReadStream(pathToFile);
    const brotliCompressStream = createBrotliCompress();
    const writeStream = createWriteStream(pathToDirectory);

    readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    writeStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    writeStream.on('finish',() => showCurrentDir());

    pipeline(
        readStream,
        brotliCompressStream,
        writeStream,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
};
