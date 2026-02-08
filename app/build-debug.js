import { spawn } from 'child_process';
import { createWriteStream } from 'fs';

const logStream = createWriteStream('build-debug.log');
const child = spawn('npm.cmd', ['run', 'build'], { shell: true });

child.stdout.pipe(logStream);
child.stderr.pipe(logStream);

child.on('close', (code) => {
    console.log(`Build exited with code ${code}`);
});
