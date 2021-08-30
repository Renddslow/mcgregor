import yaml from 'yaml';
import path from 'path';
import fm from 'frontmatter';
import { promisify } from 'util';
import fs from 'fs';
import minimatch from 'minimatch';

import cmd from '../cmd';
import messages from '../messages';
import read from '../read';

const writeFile = promisify(fs.writeFile);

type TendOpts = {
  _: string[];
  i: string;
  'skip-missing-files': boolean;
};

type Change = [string | null, { filePath: string; body: string }];

const tend = async (opts: TendOpts) => {
  const { stdout } = await cmd('git', ['config', 'user.name']);
  const [name] = stdout;

  const [date] = new Date().toISOString().split('T');

  const lastTended = {
    by: name.trim(),
    when: date,
  };

  if (!opts._.length) {
    messages.noFiles();
  }

  const changes: Change[] = await Promise.all(
    opts._.filter((p) => {
      if (!p.endsWith('.md')) return false;
      return opts.i ? minimatch(p, opts.i) : true;
    }).map(async (p): Promise<Change> => {
      const filePath = path.resolve(process.cwd(), p);
      const [err, data] = await read(filePath);

      if (err) {
        return [err.message, null];
      }

      const parsed = fm(data);
      const newData = {
        ...parsed.data,
        lastTended,
      };

      const body = `---\n${yaml.stringify(newData)}---\n${parsed.content}`;
      return [
        null,
        {
          body,
          filePath,
        },
      ];
    }),
  );

  if (changes.some(([err]) => err) && !opts['skip-missing-files']) {
    changes.filter(([err]) => err).forEach(([err]) => console.error(err));
    process.exit(1);
  }

  await Promise.all(
    changes.filter(([err]) => !err).map(([, data]) => writeFile(data.filePath, data.body)),
  );
};

export default tend;
