import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'node:readline';
import { runCommand } from './commands/runCommand.js';
import { showCurrentDir, getUserName } from "./helpers/index.js";
import {
    INVALID_INPUT,
    getWelcomeMSG,
    getGoodbyeMSG
} from "./constants.js";

const {
    stdin,
    stdout,
    chdir,
    exit
} = process;

const userName = getUserName();

process.stdout.write(getWelcomeMSG(userName));
chdir(homedir());
showCurrentDir(homedir());

const readline = createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
});

readline.on('line', async (command) => {
    // todo: remove empty strings in arr
    const cmd = command.split(' ');
    const operation = cmd[0];
    const args = cmd.slice(1).join(' ');

    try {
        await runCommand(operation, args);

    } catch(e) {
        console.error(INVALID_INPUT);
    }
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', () => {
    process.stdout.write(getGoodbyeMSG(userName));
});
