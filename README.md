<div align="center">
  <img src="https://github.com/Renddslow/mcgregor/raw/main/mcgregor.png" alt="Farmer McGregor" width="400" />
</div>

<h1 align="center">McGregor</h1>

<div align="center">
  <a href="https://npmjs.org/package/mcgregor">
    <img src="https://badgen.now.sh/npm/v/mcgregor" alt="version" />
  </a>
  <a href="https://npmjs.org/package/mcgregor">
    <img src="https://badgen.now.sh/npm/dm/mcgregor" alt="downloads" />
  </a>
  <a href="https://packagephobia.now.sh/result?p=mcgregor">
    <img src="https://packagephobia.now.sh/badge?p=mcgregor" alt="install size" />
  </a>
</div>

> 🧑‍🌾 A helpful digital gardening assistant for managing digital gardens in Hugo.

<br />

## Install

```
$ yarn add mcgregor
```


## Usage

```shell

  Description
    A helpful digital gardening assistant for managing digital gardens in Hugo.

  Usage
    $ mcgregor <command> [options]

  Available Commands
    tend    Mark who last tended a post.

  For more info, run any command with the `--help` flag
    $ mcgregor plant --help
    $ mcgregor tend --help

  Options
    -v, --version    Displays current version
    -h, --help       Displays this message

```

### `tend`

Mark who last tended a post.

Applies the `lastTended` hash to the frontmatter of a post which includes the current date and who made the modification according to the git config of the changing user.

The resulting frontmatter will look like:

```markdown
---
lastTended:
    by: Luke Skywalker
    when: 2021-08-31
---
```

Files should be passed to the `tend` script after all options have been passed:

```shell
$ mcgregor tend example.md packages/core/CHANGELOG.md
```

## API
