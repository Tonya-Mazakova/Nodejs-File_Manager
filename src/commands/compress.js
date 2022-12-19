import {
    resolve,
    isAbsolute,
    basename,
    extname,
    join
} from 'path';
import { createBrotliCompress } from 'node:zlib';
import { pipeline } from 'stream';
import {
    showCurrentDir,
    getPath,
    removeQuotes
} from "../helpers/index.js";
import { OPERATION_FAILED_ERR, INVALID_INPUT } from "../constants.js";
import {
    createReadStream,
    createWriteStream,
    stat,
    access
} from 'node:fs';
const { cwd } = process;

export const compress = async (args) => {
    const paths = args.split(' ');
    const fileName = removeQuotes(basename(paths[0]));
    const fileNameDestExt = basename(paths[1]) && extname(basename(paths[1]));
    const fileNameDest = fileNameDestExt ? '' : `${fileName}.br`;

    const pathToFile = getPath(paths[0]);

    await stat(pathToFile, (err, stats) => {
        if(err || !stats?.isFile()) {
            console.log(INVALID_INPUT);
        }
    });

    const pathToDirectoryFormatted = removeQuotes(paths[1]);

    await access(pathToDirectoryFormatted, (err) => {
        if(err) {
            console.log(INVALID_INPUT);
        }
    });

    const pathToDirectory =
        isAbsolute(pathToDirectoryFormatted)
            ? join(pathToDirectoryFormatted, fileNameDest)
            : resolve(cwd(), resolve(pathToDirectoryFormatted, fileNameDest));

    const readStream = createReadStream(pathToFile);
    const brotliCompressStream = createBrotliCompress();
    const writeStream = createWriteStream(pathToDirectory);

    readStream.on('error', () => {
        // console.log(OPERATION_FAILED_ERR)
    });
    writeStream.on('error', () => {
        // console.log(OPERATION_FAILED_ERR)
    });
    writeStream.on('finish',() => showCurrentDir());

    pipeline(
        readStream,
        brotliCompressStream,
        writeStream,
        (err) => {
            if (err) {
                console.error(OPERATION_FAILED_ERR);
            }
        }
    );
};
