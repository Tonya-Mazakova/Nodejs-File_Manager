import { isAbsolute, resolve } from 'path';
import { writeFile } from 'node:fs';
import { showCurrentDir } from "../helpers/index.js";
import { cp } from "./cp.js";
import { rm } from "./rm.js";
const { cwd } = process;

export const mv = async (args) => {
    const paths = args.split(' ');
    const pathToFileCopy = isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

    await cp(args);
    await rm(pathToFileCopy);
    showCurrentDir();
};
