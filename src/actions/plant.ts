import path from 'path';
import { default as globby } from 'globby';
import * as fs from 'fs';
import mkdirp from 'mkdirp';
import { URL } from 'url';

type HoeOpts = {
  c: string;
};

const getAllLinks = (content: string): string[] => {
  const links = [];
  const regexpr = /\[(?:.*?)]\((.*?)\)/g;
  let res = regexpr.exec(content);
  while (res !== null) {
    const [, link] = res;
    links.push(link);
    res = regexpr.exec(content);
  }
  return links;
};

const filterForInternalLinks = (link: string): boolean =>
  /^\//.test(link) && !/\.(png|jpg|jpeg|gif|svg)$/.test(link);
const cleanLinks = (link: string): string => {
  const linkWithoutTrailingSlash = link.replace(/\/$/, '');
  const uri = new URL(linkWithoutTrailingSlash);
  return uri.pathname;
};

const urlize = (link: string) => {
  const normalizedLink = path.normalize(
    link.endsWith('_index.md') ? link.replace(/_index\.md$/, '/') : link.replace(/\.md$/, ''),
  );
  return normalizedLink.startsWith('/') ? normalizedLink : `/${normalizedLink}`;
};

const plant = async (dest: string, opts: HoeOpts) => {
  const basePath = path.join(process.cwd(), opts.c);
  const allPaths = await globby('**/*.md', {
    cwd: basePath,
  });

  const tree: { [path: string]: { [link: string]: true } } = {};

  allPaths.forEach((p) => {
    const contents = fs.readFileSync(path.join(basePath, p)).toString();
    const contentLinks = getAllLinks(contents).filter(filterForInternalLinks).map(cleanLinks);
    contentLinks.forEach((link) => {
      tree[link] = {
        ...tree[link],
        [cleanLinks(p)]: true,
      };
    });
  });

  const dedupedTree = Object.keys(tree).reduce((acc: { [path: string]: string[] }, key: string) => {
    acc[key] = Object.keys(tree[key]).map(urlize);
    return acc;
  }, {});

  const destinationPath = path.join(process.cwd(), dest);

  await mkdirp(path.dirname(destinationPath));
  fs.writeFileSync(destinationPath, JSON.stringify(dedupedTree, null, 2));
  console.log(`  Planted backlinks tree in ${destinationPath}`);
};

export default plant;
