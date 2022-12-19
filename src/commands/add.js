import { join } from 'path';
import { writeFile } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";
import { OPERATION_FAILED_ERR } from "../constants.js";
const { cwd } = process;

export const add = async (fileName) => {
    let pathToNewFile = join(cwd(), fileName);

    await writeFile(pathToNewFile, '', (err) => {
        if (err) console.error(OPERATION_FAILED_ERR);
    });

    showCurrentDir();
};
