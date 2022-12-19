import { resolve, isAbsolute } from 'path';
import { stat } from 'node:fs';
import { showCurrentDir, getPath } from "../helpers/index.js";
import { OPERATION_FAILED_ERR, INVALID_INPUT } from "../constants.js";
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';

export const hash = async (path) => {
    const pathToFile = getPath(path);
    const hash = createHash('sha256');

    await stat(pathToFile, (err, stats) => {
        if(err || !stats.isFile()) {
            console.log(INVALID_INPUT);
        }
    });

    const readStream = await createReadStream(pathToFile);
    readStream.on('data', async chunk => {
        const hex = hash.update(chunk).digest('hex');
        console.log(hex);
    });

    readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    readStream.on('end', () => showCurrentDir());
};
