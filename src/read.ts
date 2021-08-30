import fs from 'fs';
import { promisify } from 'util';
import catchify from 'catchify';

const readFile = promisify(fs.readFile);

const read = async (fp: string): Promise<[Error | null, string | null]> => {
  const [err, data] = await catchify(readFile(fp));

  if (err) {
    return [err, null];
  }

  return [null, data.toString()];
};

export default read;
