// const shellSync = require('./shellSync');
const execSync = require('child_process').execSync;
const execFile = require('child_process').execFile;
const BIN_PATH = '/tmp/phantom/node_modules/phantomjs-prebuilt/bin/';
const PHANTOM_PATH = '/tmp/phantom';

const pack = exports = module.exports = {};

pack.state = [];

pack.packPack = (message) => {
    pack.state += ' \n' + message;
    console.log('pack:' + message)
};

pack.isAWSHosted = () => {
    const functionName = process.env.AWS_LAMBDA_FUNCTION_NAME || undefined;

    return functionName !== undefined;
};

const shellSync = (command, cwd) => {
    console.log('shellSync:', command);

    const options = {};
    const env = process.env;
    env.npm_config_cache ='/tmp/.npm';
    options.cwd = cwd;
    options.env = env;

    return execSync(command, options).toString();
};

pack.installPhantom = () => {
    pack.packPack("Install Phantom Called");
    if(pack.isAWSHosted()) {
        pack.packPack("Install Phantom Called: IS HOSTED");
        const mkdirOut = shellSync(`mkdir -p ${PHANTOM_PATH}`);
        pack.packPack(`mkdirOut: ${mkdirOut}`);

        const mkdir2Out = shellSync(`mkdir -p /tmp/.npm`);
        pack.packPack(`mkdir2Out: ${mkdir2Out}`);

        try {
            const npmInstall = shellSync('npm install phantomjs-prebuilt', PHANTOM_PATH);
            pack.packPack(`npmInstall: [[ ${npmInstall} ]] `);
        }
        catch(e) {
            pack.packPack(`npmInstall error: ${e}`);
        }


        // const lsOut = shellSync('ls -a', '/tmp/phantom/node_modules/phantomjs-prebuilt/bin');
        // pack.packPack(`lsOut: ${lsOut}`);
    }
    else {
        console.log('Its not hosted at AWS');
    }
};

pack.path = BIN_PATH;

pack.exec = function(args, onComplete) {
    
    console.log('exec phantom: ', args)

    return execFile('/tmp/phantom/node_modules/phantomjs-prebuilt/bin/phantomjs', ['-v'], onComplete);
};