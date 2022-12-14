import {
    dirname,
    resolve,
    isAbsolute,
    parse,
    join,
    extname,
    basename,
    normalize
} from 'path';
import {
    homedir,
    EOL,
    cpus,
    userInfo,
    arch
} from 'os';
import {
    readdir,
    createReadStream,
    createWriteStream,
    writeFile,
    rename,
    rm,
    readFile
} from 'node:fs';
import { createHash } from 'node:crypto';
import { pipeline } from 'stream';
import {
    createBrotliCompress,
    createBrotliDecompress
} from 'node:zlib';
import { fileURLToPath } from 'url';
import { createInterface } from 'node:readline';

const {
    stdin,
    stdout,
    cwd,
    chdir,
    exit
} = process;

let userName = 'Anonymous';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const USERNAME_PREFIX = '--username=';
const OPERATION_FAILED_ERR = 'Operation failed';

// todo: refactor, split this file
const runCommand = async (command, args) => {
    const COMMANDS = {
        '.exit': () => exit(),
        up: async () => {
            const newPath = await resolve(cwd(), '../');
            await chdir(newPath);
            showCurrentDir();
        },
        cd: async (path) => {
            // todo: remove quotes at start and end
            const formattedPath = path.replace(/['"]+/g, '');
            const newPath =
                isAbsolute(formattedPath) ? formattedPath : resolve(cwd(), formattedPath);

            await chdir(newPath);
            showCurrentDir();
        },
        ls: async () => {
            await readdir(cwd(), { withFileTypes: true }, (err, files) => {
                if (err) {
                    return console.log(OPERATION_FAILED_ERR);
                }

                const result = files.map((file) => {
                    return { Name: file.name, Type: file.isFile() ? 'file' : 'directory' }
                });

                // todo: re-check
                const sortByName = (prev, next) => {
                    if (next.Name > prev.Name) {
                        return -1;
                    }

                    return 1;
                };

                const sortByType = (prev, next) => {
                    if (prev.Type === 'directory' && next.Type === 'file') {
                        return -1;
                    }

                    return 1;
                };

                const resultSortedByName = result.sort(sortByName);
                const resultSortedByType = resultSortedByName.sort(sortByType);

                console.table(resultSortedByType);
                showCurrentDir();
            })
        },
        cat: async (path) => {
            const readStream = await createReadStream(path);
            readStream.on('data', chunk => console.log(chunk.toString()));
            readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
            readStream.on('end', () => showCurrentDir());
        },
        add: async (fileName) => {
            let pathToNewFile = join(cwd(), fileName);

            writeFile(pathToNewFile, '', (err) => {
                if (err) console.error(OPERATION_FAILED_ERR);
            });

            showCurrentDir();
        },
        rn: async (args) => {
            const paths = args.split(' ');

            rename(paths[0], paths[1], (err) => {
                if (err) console.error(OPERATION_FAILED_ERR);
            });

            showCurrentDir();
        },
        cp: async (args) => {
            // todo: re-check, no permissions if C disk
            const paths = args.split(' ');
            const fileName = basename(paths[0]);
            const pathToFileCopy =
                isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

            const pathToDirectory =
                isAbsolute(paths[1]) ? join(paths[1], fileName) : resolve(cwd(), paths[1], fileName);

            const readStream = await createReadStream(pathToFileCopy);
            const writeStream = await createWriteStream(pathToDirectory);

            readStream.on('error', () => console.error(OPERATION_FAILED_ERR));
            writeStream.on('error', () => console.error(OPERATION_FAILED_ERR));

            await readStream
                .pipe(writeStream)
                .on('error', () => console.error(OPERATION_FAILED_ERR));

            showCurrentDir();
        },
        mv: async (args) => {
            const paths = args.split(' ');
            const pathToFileCopy = isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

            await COMMANDS.cp(args);
            await COMMANDS.rm(pathToFileCopy);
            showCurrentDir();
        },
        rm: async (path) => {
            await rm(path, (err) => { if (err) console.error(err) });
            showCurrentDir();
        },
        os: (operation) => {
            switch (operation) {
                case '--EOL':
                    console.log(JSON.stringify(EOL));
                    break;

                case '--cpus':
                    const result = cpus().map((cpu) => {
                        return { model: cpu?.model, speed: cpu?.speed }
                    });
                    console.log(result);
                    break;

                case '--homedir':
                    console.log(homedir());
                    break;

                case '--username':
                    console.log(userInfo().username);
                    break;

                case '--architecture':
                    console.log(arch());
                    break;
            };

            showCurrentDir();
        },
        hash: async (path) => {
            const pathToFile = isAbsolute(path) ? path : resolve(cwd(), path);
            const hash = createHash('sha256');

            const readStream = await createReadStream(pathToFile);
            readStream.on('data', async chunk => {
                const hex = hash.update(chunk).digest('hex')
                console.log(hex)
            });
            readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
            readStream.on('end', () => showCurrentDir());
        },
        // todo: add error handling
        compress: async (args) => {
            const paths = args.split(' ');
            const fileName = basename(paths[0]);
            const fileNameDestExt = basename(paths[1]) && extname(basename(paths[1]));
            const fileNameDest = fileNameDestExt ? '' : `${fileName}.br`;

            const pathToFile =
                isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

            const pathToDirectory =
                isAbsolute(paths[1])
                    ? join(paths[1], fileNameDest)
                    : resolve(cwd(), resolve(paths[1], fileNameDest));

            const readStream = createReadStream(pathToFile);
            const brotliCompressStream = createBrotliCompress();
            const writeStream = createWriteStream(pathToDirectory);

            readStream.on('error', () => console.log(OPERATION_FAILED_ERR));
            writeStream.on('error', () => console.log(OPERATION_FAILED_ERR));
            writeStream.on('finish',() => showCurrentDir());

            pipeline(
                readStream,
                brotliCompressStream,
                writeStream,
                (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        },
        // todo: add error handling
        decompress: async () => {
            const paths = args.split(' ');
            const fileName = parse(basename(paths[0])).name;

            const pathToFile =
                isAbsolute(paths[0]) ? paths[0] : resolve(cwd(), paths[0]);

            const pathToDirectory =
                isAbsolute(paths[1])
                    ? join(paths[1], fileName)
                    : resolve(cwd(), resolve(paths[1], fileName));

            const readStream = createReadStream(pathToFile);
            const brotliDecompressStream = createBrotliDecompress();
            const writeStream = createWriteStream(pathToDirectory);

            readStream.on('error', (err) => console.log(OPERATION_FAILED_ERR));
            writeStream.on('error', (err) => console.log(OPERATION_FAILED_ERR));
            writeStream.on('finish',() => showCurrentDir());

            pipeline(
                readStream,
                brotliDecompressStream,
                writeStream,
                (err) => {
                    if (err) {
                        console.error(err);
                    }
                }
            );
        }
    };

    return await COMMANDS[command](args)
};

// todo: refactor
export const getWelcomeMsg = () => {
    let welcomeMSG = `Welcome to the File Manager, Anonymous!\n`;

    for ( let i = 0; i < process.argv.length; i++) {

        if (process.argv[i].startsWith(USERNAME_PREFIX)) {
            userName = process.argv[i].split(USERNAME_PREFIX)[1];
            userName = userName.charAt(0).toUpperCase() + userName.slice(1);

            welcomeMSG = `Welcome to the File Manager, ${userName || 'Anonymous'}!\n`;
        }

    }

    return welcomeMSG;
};

const showCurrentDir = (currentDir = cwd()) => stdout.write(`You are currently in ${currentDir}\n`);

process.stdout.write(getWelcomeMsg());
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
