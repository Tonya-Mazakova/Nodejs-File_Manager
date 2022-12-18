import { isAbsolute, resolve } from 'path';
import { writeFile } from 'node:fs';
import { getPath } from "../helpers/index.js";
import { cp } from "./cp.js";
import { rm } from "./rm.js";

export const mv = async (args) => {
    const paths = args.split(' ');
    const pathToFileCopy = getPath(paths[0]);

    await cp(args);
    await rm(pathToFileCopy);
};
