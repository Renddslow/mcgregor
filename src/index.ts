#!/usr/bin/env node

import sade from 'sade';
import readPackage from 'read-pkg-up';

import tend from './actions/tend';

type SeedOpts = {
  _: string[];
  c: boolean;
  a: boolean;
  'alias-key': string;
};

(async () => {
  const McGregor = sade('mcgregor')
    .version((await readPackage()).packageJson.version)
    .describe('A helpful digital gardening assistant for managing digital gardens in Hugo.');

  // McGregor.command('seed')
  //   .describe('Scoop up wiki-style links and transform them into markdown links.')
  //   .example('seed example.md')
  //   .option(
  //     '-c, --create-pages',
  //     `Create pages when wiki links point to pages that don't exist.`,
  //     false,
  //   )
  //   .option('-a, --use-aliases', '', false)
  //   .option('--alias-key', '', 'alias')
  //   .action((opts: SeedOpts) => {
  //     console.log(opts);
  //   });

  McGregor.command('tend')
    .describe('Mark who last tended a post.')
    .option('-i, --ignore', 'Glob string of files to ignore', '')
    .option(
      '--skip-missing-files',
      'If a file referenced is missing, skip over it and quietly alert in the console',
      false,
    )
    .action(tend);

  McGregor.parse(process.argv);
})();
