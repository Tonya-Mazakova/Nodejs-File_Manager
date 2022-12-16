import { createReadStream } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";

export const cat = async (path) => {
    const readStream = await createReadStream(path);
    readStream.on('data', chunk => console.log(chunk.toString()));
    readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    readStream.on('end', () => showCurrentDir());
};
