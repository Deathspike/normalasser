# normalize-ssa

Extracts ssa/ass subtitle(s) from MKV videos and rescale/resize subtitles. This is a standalone derivative of the rescale/resize that occurs in [AnimeLoyalty](https://github.com/animeloyalty/animeloyalty). If you're using *AnimeLoyalty*, there's no need for this standalone tool. This is for all those locally stored files that you want to give the same rescale/resize in a different player.

# Prerequisites

* NodeJS >= 14 (http://nodejs.org/)
* NPM >= 6 (https://www.npmjs.org/)

# Install

## Windows

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Run in *Command Prompt*: `npm install -g normalize-ssa`

## Mac OS X

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Run in *Terminal*: `npm install -g normalize-ssa`

## Debian (Mint, Ubuntu, etc)

1. Install *NodeJS* following the instructions at http://nodejs.org/
2. Run in *Terminal*: `sudo apt-get install ffmpeg`
3. Run in *Terminal*: `sudo npm install -g normalize-ssa`

# Update

## Windows

1. Ensure that `normalize-ssa` is [installed](#Install)
2. Run in *Command Prompt*: `npm install -g normalize-ssa`

## Mac OS X

1. Ensure that `normalize-ssa` is [installed](#Install)
2. Run in *Terminal*: `npm install -g normalize-ssa`

## Debian (Mint, Ubuntu, etc)

1. Ensure that `normalize-ssa` is [installed](#Install)
2. Run in *Terminal*: `sudo npm install -g normalize-ssa`

# Usage

```
Usage: normalize-ssa [options] [command]

Extracts ssa/ass subtitle(s) from MKV videos and rescale/resize subtitles.

Options:
  -V, --version                      output the version number
  -h, --help                         display help for command

Commands:
  parse [options] <resourcePath...>  Parse subtitle(s).
  help [command]                     display help for command
```

## Parse

To parse *subtitles* and rescale/resize, run:

    normalize-ssa parse /path/to/your/video.mkv

Or to recursively find and parse `.ass`/`.mkv` files in a folder, run:

    normalize-ssa parse /path/to/your/folder

To extract a single language from a `.mkv`, like `eng` for English, run:

    normalize-ssa parse -l eng /path/to/your/folder

And to select a different font size, run:

    normalize-ssa parse -l eng -s large /path/to/your/folder

The valid font sizes are `tiny`, `small`, `normal`, `large` or `huge`.

# Contributions

While software contributions are welcome, you can also help with:

* Documentation
* Helping other people
* Feature requests
* Bug reports

# Questions?

Please make an issue if you have questions, wish to request a feature, etc.
