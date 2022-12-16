import { resolve, isAbsolute } from 'path';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";
import { createReadStream } from 'node:fs';
import { createHash } from 'node:crypto';
const { cwd } = process;

export const hash = async (path) => {
    const pathToFile = isAbsolute(path) ? path : resolve(cwd(), path);
    const hash = createHash('sha256');

    const readStream = await createReadStream(pathToFile);
    readStream.on('data', async chunk => {
        const hex = hash.update(chunk).digest('hex');
        console.log(hex);
    });
    readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    readStream.on('end', () => showCurrentDir());
};
