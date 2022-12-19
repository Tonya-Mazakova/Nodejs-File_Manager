import { resolve, isAbsolute } from 'path';
import { readdir } from 'node:fs';
import {
    sortByName,
    sortByType,
    showCurrentDir
} from "../helpers/index.js";
import { OPERATION_FAILED_ERR, INVALID_INPUT } from "../constants.js";
const { cwd } = process;

export const ls = async (args) => {
    if (args) {
        return console.error(INVALID_INPUT);
    }

    await readdir(cwd(), { withFileTypes: true }, (err, files) => {
        if (err) {
            return console.log(OPERATION_FAILED_ERR);
        }

        const result = files.map((file) => {
            return { Name: file.name, Type: file.isFile() ? 'file' : 'directory' }
        });

        const resultSortedByName = result.sort(sortByName);
        const resultSortedByType = resultSortedByName.sort(sortByType);

        console.table(resultSortedByType);
        showCurrentDir();
    })
};
