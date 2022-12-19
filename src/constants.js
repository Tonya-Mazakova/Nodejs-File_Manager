const OPERATION_FAILED_ERR = 'Operation failed';
const USERNAME_PREFIX = '--username=';
const INVALID_INPUT = 'Invalid input';
const getWelcomeMSG = (userName) => `Welcome to the File Manager, ${userName || 'Anonymous'}!\n`;
const getGoodbyeMSG = (userName) => `Thank you for using File Manager, ${userName || 'Anonymous'}, goodbye!\n`;

export {
    OPERATION_FAILED_ERR,
    USERNAME_PREFIX,
    INVALID_INPUT,
    getWelcomeMSG,
    getGoodbyeMSG
}
