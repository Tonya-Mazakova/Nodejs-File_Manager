import {
    resolve,
    isAbsolute,
    basename,
    extname,
    join,
    parse
} from 'path';
import { createBrotliDecompress } from 'node:zlib';
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

export const decompress = async (args) => {
    const paths = args.split(' ');
    const fileName = parse(basename(paths[0])).name;
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
            ? join(pathToDirectoryFormatted, fileName)
            : resolve(cwd(), resolve(pathToDirectoryFormatted, fileName));

    const readStream = createReadStream(pathToFile);
    const brotliDecompressStream = createBrotliDecompress();
    const writeStream = createWriteStream(pathToDirectory);

    readStream.on('error', (err) => {
        // console.log(OPERATION_FAILED_ERR)
    });
    writeStream.on('error', (err) => {
        // console.log(OPERATION_FAILED_ERR)
    });
    writeStream.on('finish',() => showCurrentDir());

    pipeline(
        readStream,
        brotliDecompressStream,
        writeStream,
        (err) => {
            if (err) {
                console.error(err);
            }
        }
    );
};
