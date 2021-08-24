import sade from 'sade';
import readPackage from 'read-pkg-up';
import path from 'path';

import cmd from './cmd';
import messages from './messages';

type SeedOpts = {
  _: string[];
  c: boolean;
  a: boolean;
  'alias-key': string;
};

type TendOpts = {
  _: string[];
  i: string;
};

(async () => {
  const McGregor = sade('mcgregor')
    .version((await readPackage()).packageJson.version)
    .describe('');

  McGregor.command('seed')
    .describe('Scoop up wiki-style links and transform them into markdown links.')
    .example('seed example.md')
    .option(
      '-c, --create-pages',
      `Create pages when wiki links point to pages that don't exist.`,
      false,
    )
    .option('-a, --use-aliases', '', false)
    .option('--alias-key', '', 'alias')
    .action((opts: SeedOpts) => {
      console.log(opts);
    });

  McGregor.command('tend')
    .describe('Mark who last tended a post')
    .option('-i, --ignore', 'Glob string of files to ignore')
    .action(async (opts: TendOpts) => {
      const { stdout } = await cmd('git', ['config', 'user.name']);
      const [name] = stdout;

      const [date] = new Date().toISOString().split('T');

      const tendedData = {
        lastTended: {
          by: name.trim(),
          when: date,
        },
      };

      if (!opts._.length) {
        messages.noFiles();
      }

      opts._.map((p) => {
        const filePath = path.resolve(process.cwd(), p);
        console.log(filePath);
      });

      console.log(tendedData);
    });

  McGregor.parse(process.argv);
})();
