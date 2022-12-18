import { USERNAME_PREFIX } from "../constants.js";

export const getUserName = () => {
    let userName = 'Anonymous';

    for ( let i = 0; i < process.argv.length; i++) {
        if (process.argv[i].startsWith(USERNAME_PREFIX)) {
            userName = process.argv[i].split(USERNAME_PREFIX)[1];
            return userName = userName.charAt(0).toUpperCase() + userName.slice(1);
        }
    }
};

