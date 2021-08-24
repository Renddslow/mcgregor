import kleur from 'kleur';

export default {
  noFiles: () => {
    console.error(
      kleur.red(`${kleur.bold('mgregror tend')} was run against ${kleur.bold(0)} files\n`),
    );
    console.log(
      kleur.gray(
        `  To run correctly, a series of filenames should be provided to mgregor as the last argument:`,
      ),
    );
    console.log(`  ${kleur.bold('mgregor tend')} example.md content/_index.md README.md\n`);
    process.exit(1);
  },
};
