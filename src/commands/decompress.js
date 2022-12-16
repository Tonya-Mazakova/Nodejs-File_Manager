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
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";
import { createReadStream, createWriteStream } from 'node:fs';
const { cwd } = process;

// todo: add error handling
export const decompress = async (args) => {
    const paths = args.split(' ');
    const fileName = parse(basename(paths[0])).name;

    const pathToFile =
        isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

    const pathToDirectory =
        isAbsolute(paths[1])
            ? join(paths[1], fileName)
            : resolve(cwd(), resolve(paths[1], fileName));

    const readStream = createReadStream(pathToFile);
    const brotliDecompressStream = createBrotliDecompress();
    const writeStream = createWriteStream(pathToDirectory);

    readStream.on('error', (err) => console.log(OPERATION_FAILED_ERR));
    writeStream.on('error', (err) => console.log(OPERATION_FAILED_ERR));
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
