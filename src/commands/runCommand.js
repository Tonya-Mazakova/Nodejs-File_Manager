import { cp } from "./cp.js";
import { compress } from "./compress.js";
import { ls } from "./ls.js";
import { cat } from "./cat.js";
import { hash } from "./hash.js";
import { rm } from "./rm.js";
import { os } from "./os.js";
import { add } from "./add.js";
import { rn } from "./rn.js";
import { up } from "./up.js";
import { cd } from "./cd.js";
import { mv } from "./mv.js";
import { decompress } from "./decompress.js";

export const COMMANDS = {
    '.exit': () => process.exit(),
    up: async () => await up(),
    cd: async (path) => await cd(path),
    ls: async () => await ls(),
    cat: async (path) => await cat(path),
    add: async (fileName) => await add(fileName),
    rn: async (args) => await rn(args),
    cp: async (args) => await cp(args),
    mv: async (args) => await mv(args),
    rm: async (path) => await rm(path),
    os: (operation) => os(operation),
    hash: async (path) => await hash(path),
    compress: async (args) => await compress(args),
    decompress: async (args) => await decompress(args)
};

export const runCommand = async (command, args) => {
    return await COMMANDS[command](args)
};
