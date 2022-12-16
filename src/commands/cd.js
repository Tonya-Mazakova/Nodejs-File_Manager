import { resolve, isAbsolute } from 'path';
import { showCurrentDir } from "../helpers/index.js";
const { chdir, cwd } = process;

export const cd = async (path) => {
    // todo: remove quotes at start and end
    const formattedPath = path.replace(/['"]+/g, '');
    const newPath =
        isAbsolute(formattedPath) ? formattedPath : resolve(cwd(), formattedPath);

    await chdir(newPath);
    showCurrentDir();
};
