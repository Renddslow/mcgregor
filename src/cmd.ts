import { spawn } from 'child_process';

type Response = {
  stdout: string[];
  stderr: string[];
};

const makeCmd = (cmd: string, args: string[]): Promise<Response> =>
  new Promise((resolve) => {
    const response: Response = {
      stdout: [],
      stderr: [],
    };

    const proc = spawn(cmd, args);

    proc.stdout.on('data', (data) => response.stdout.push(data.toString()));
    proc.stderr.on('data', (data) => response.stderr.push(data.toString()));

    proc.on('error', (error) => response.stderr.push(error.message));
    proc.on('exit', (code) => {
      if (code > 0) {
        response.stderr.push(`Exited with code ${code}`);
      }
      resolve(response);
    });
  });

export default makeCmd;
