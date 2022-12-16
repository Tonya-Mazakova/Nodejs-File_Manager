import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'node:readline';
import { runCommand } from './commands/runCommand.js';
import { showCurrentDir, getUserName } from "./helpers/index.js";
const {
    stdin,
    stdout,
    chdir,
    exit
} = process;

const userName = getUserName();

process.stdout.write(`Welcome to the File Manager, ${userName || 'Anonymous'}!\n`);
chdir(homedir());
showCurrentDir(homedir());

const readline = createInterface({
    input: stdin,
    output: stdout,
    prompt: '> '
});

// todo: handle error commands
readline.on('line', async (command) => {
    // todo: remove empty strings in arr
    const cmd = command.split(' ');
    const operation = cmd[0];
    const args = cmd.slice(1).join(' ');

    try {
        await runCommand(operation, args);

    } catch(e) {
        console.error("Invalid input");
    }
});

process.on('SIGINT', () => {
    process.exit();
});

process.on('exit', () => {
    process.stdout.write(`Thank you for using File Manager, ${userName}, goodbye!\n`);
});
