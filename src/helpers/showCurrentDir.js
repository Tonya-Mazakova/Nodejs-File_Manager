const { stdout, cwd } = process;

export const showCurrentDir = (currentDir = cwd()) =>
    stdout.write(`You are currently in ${currentDir}\n`);
