import {
    homedir,
    EOL,
    cpus,
    userInfo,
    arch
} from 'os';
import { showCurrentDir } from "../helpers/index.js";
import { INVALID_INPUT } from "../constants.js";

const OPERATIONS = {
    eol: '--EOL',
    cpus: '--cpus',
    homedir: '--homedir',
    username: '--username',
    architecture: '--architecture'
};

export const os = (operation) => {
    if (!Object.values(OPERATIONS).includes(operation)) {
        return console.error(INVALID_INPUT);
    }

    switch (operation) {
        case OPERATIONS.eol:
            console.log(JSON.stringify(EOL));
            break;

        case OPERATIONS.cpus:
            const result = cpus().map((cpu) => {
                return { model: cpu?.model, speed: cpu?.speed }
            });
            console.log(result);
            break;

        case OPERATIONS.homedir:
            console.log(homedir());
            break;

        case OPERATIONS.username:
            console.log(userInfo().username);
            break;

        case OPERATIONS.architecture:
            console.log(arch());
            break;
    }

    showCurrentDir();
};
