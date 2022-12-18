import { rm as remove, stat } from 'node:fs';
import { showCurrentDir, removeQuotes } from "../helpers/index.js";
import { INVALID_INPUT, OPERATION_FAILED_ERR } from "../constants.js";

export const rm = async (path) => {
    const pathToFile = removeQuotes(path);

    await stat(pathToFile, (err, stats) => {
        if(err || !stats.isFile()) {
            console.log(INVALID_INPUT);
        }
    });

    await remove(pathToFile, (err) => {
        if (err) {
            return console.error(OPERATION_FAILED_ERR);
        }

        showCurrentDir();
    });
};
