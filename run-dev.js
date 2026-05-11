// Simple dev runner using Node built-ins
// Spawns backend and frontend dev servers and pipes output
import { spawn } from 'child_process';
import path from 'path';

function run(cmd, args, cwd, name) {
  const p = spawn(cmd, args, { cwd, shell: true, stdio: 'inherit' });
  p.on('exit', (code) => console.log(`${name} exited with ${code}`));
}

const root = path.resolve('.');
run('npm', ['run', 'dev'], path.join(root, 'backend'), 'Backend');
run('npm', ['run', 'dev'], path.join(root, 'frontend'), 'Frontend');
