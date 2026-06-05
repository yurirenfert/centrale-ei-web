import { spawn } from 'child_process';

// spawn a child process to run the seed script

let running = false;

export function runRecommandation() {
  if (running) {
    console.log('Recommandation job is already running, skipping this run.');

    return;
  }

  console.log('Starting recommandation job...');
  running = true;

  const python = spawn('python3', ['./recommandation.py']);

  python.stdout.on('data', (data) => {
    console.log(`stdout: ${data}`);
  });

  python.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
  });

  python.on('close', (code) => {
    console.log(`Recommandation job finished with code ${code}`);
    running = false;
  });
}

export function startRecommandationJob() {
  runRecommandation(); // run immediately on startup

  // then schedule to run every hour at minute 0
  const HOUR_MS = 60 * 60 * 1000;
  setInterval(() => {
    runRecommandation();
  }, HOUR_MS);
}
