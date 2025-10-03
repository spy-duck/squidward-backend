import { spawnSync, execSync } from 'node:child_process';
import commandLineArgs from 'command-line-args';
import { readPackageJSON } from 'pkg-types';
import { colorize } from 'consola/utils';
import { consola } from 'consola';

 
const options = commandLineArgs([
    { name: 'yes', alias: 'y', type: Boolean },
    { name: 'no-push', alias: 'n', type: Boolean },
    { name: 'no-cache', alias: 'c', type: Boolean },
]) as {
    yes: boolean,
    'no-push': boolean,
    'no-cache': boolean,
};

void (async () => {
    const imageName = 'squidwardproxy/squidward';
    const pkg = await readPackageJSON();
    let sigTerm = false;
    
    process.on('SIGTERM', () => {
        if (!sigTerm) {
            sigTerm = true;
            consola.log('SIGTERM received, exiting...');
            process.exit(0);
        }
    });
    
    // const loader = createLoader();
    
    if (!options.yes && !await consola.prompt('Confirm deploy', { type: 'confirm' })) {
        consola.log('Exit...');
        process.exit(0);
    }
    
    consola.start(`Starting deploy v${ pkg.version }...`);
    
    consola.start(`Starting building docker image`);
    spawnSync('docker', [
        'build',
        '--progress=plain',
        '--build-arg CI=true',
        ...(options['no-cache'] ? [ '--no-cache' ] : []),
        '-t',
        `${ imageName }:${ pkg.version }`,
        ' -t',
        `${ imageName }:latest`,
        '.',
    ], { stdio: 'inherit', shell: true });
    consola.success('Docker image build finished');
    
    if (!options['no-push'] && await consola.prompt('Push docker image to Docker Hub', { type: 'confirm' })) {
        spawnSync('docker', [
            'push',
            '--all-tags',
            imageName,
        ], { stdio: 'inherit', shell: true });
    }
    
    consola.start(`Starting cleanup`);
    spawnSync('rm -rf node_contracts');
    consola.success('Cleanup finished');
    consola.log('Exit...');
    process.exit(0);
    
})();

function createLoader() {
    const P = [
        '⠋',
        '⠙',
        '⠹',
        '⠸',
        '⠼',
        '⠴',
        '⠦',
        '⠧',
        '⠇',
        '⠏',
    ];
    let x = 0;
    let loader: NodeJS.Timeout | undefined;
    let lineText = '';
    
    function start(text: string) {
        lineText = text;
        loader = setInterval(() => {
            process.stdout.write(`\r${ colorize('blue', P[x++]) } ${ colorize('gray', text) }`);
            x %= P.length;
        }, 200);
    }
    
    function stop() {
        if (loader) {
            clearInterval(loader);
            process.stdout.write('\r' + ' '.repeat(lineText.length + 2) + '\r');
            x = 0;
        }
    }
    
    return {
        start,
        stop,
    }
}