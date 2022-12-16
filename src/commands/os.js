// import {
//     homedir,
//     EOL,
//     cpus,
//     userInfo,
//     arch
// } from 'os';
import { showCurrentDir } from "../helpers/index.js";

export const os = async (operation) => {
    // switch (operation) {
    //     case '--EOL':
    //         console.log(JSON.stringify(EOL));
    //         break;
    //
    //     case '--cpus':
    //         const result = cpus().map((cpu) => {
    //             return { model: cpu?.model, speed: cpu?.speed }
    //         });
    //         console.log(result);
    //         break;
    //
    //     case '--homedir':
    //         console.log(homedir());
    //         break;
    //
    //     case '--username':
    //         console.log(userInfo().username);
    //         break;
    //
    //     case '--architecture':
    //         console.log(arch());
    //         break;
    // }

    showCurrentDir();
};
