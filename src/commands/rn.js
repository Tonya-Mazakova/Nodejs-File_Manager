import { rename } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";

export const rn = async (args) => {
    const paths = args.split(' ');

    await rename(paths[0], paths[1], (err) => {
        if (err) console.error(OPERATION_FAILED_ERR);
    });

    showCurrentDir();
};
