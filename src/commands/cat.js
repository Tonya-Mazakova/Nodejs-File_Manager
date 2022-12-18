import { createReadStream, stat } from 'node:fs';
import { showCurrentDir, getPath } from "../helpers/index.js";
import { OPERATION_FAILED_ERR, INVALID_INPUT } from "../constants.js";

export const cat = async (arg) => {
    const path = getPath(arg);

    await stat(path, (err, stats) => {
        if(err || stats.isDirectory()){
            console.log(INVALID_INPUT);
        }
    });

    const readStream = await createReadStream(path);
    readStream.on('data', chunk => console.log(chunk.toString()));
    readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
    readStream.on('end', () => showCurrentDir());
};
