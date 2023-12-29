# normalasser

Extract `ass` subtitles from `mkv` videos and normalizes them. Unlike text-based subtitles like `srt`, `ass` subtitles have embedded styles that determine their appearance on screen. You have no control over the subtitle size. _Normalasser_ overrides offending styles to ensure a consistent subtitle size, while leaving other styles intact.

# Prerequisites

- [`node`](http://nodejs.org/) >= `18`
- [`npm`](https://www.npmjs.org/) >= `8`
- [`ffmpeg`](https://ffmpeg.org/) >= `6`

# Install

```
npm install -g normalasser
```

# Usage

```
Usage: normalasser [options] [command]

Extract ass subtitles from mkv videos and normalizes them.

Options:
  -V, --version              output the version number
  -h, --help                 display help for command

Commands:
  parse [options] <path...>  Parse subtitles
  server [options]           Listen for HTTP events
  help [command]             display help for command
```

## Parse

Parse extracts `ass` subtitles from `mkv` videos and normalizes them, or normalizes already extracted `ass` subtitles. When invoked with a folder path, _normalasser_ will recursively scan for `mkv` videos without an extracted `ass` subtitle.

### Examples

A) Extract _English_ `ass` subtitle from a `mkv` video and normalize to a _normal_ size:

    normalasser parse /path/to/your/video.mkv

B) Extract _German_ `ass` subtitle from a `mkv` video and normalize to a _normal_ size:

    normalasser parse --language ger /path/to/your/video.mkv

C) Extract _English_ `ass` subtitle from a `mkv` video and normalize to a _small_ size:

    normalasser parse --size small /path/to/your/video.mkv

## Server

Server will run a HTTP server that listens to `POST` requests on port `7883`. Once a request comes in, _normalasser_ runs `parse` on the received path. Requests may be queued up and will execute when the previous requests have finished. The HTTP listener is compatible with _Radarr_ and _Sonarr_ webhooks.

# Contributions

While software contributions are welcome, you can also help with:

- Documentation
- Helping other people
- Feature requests
- Bug reports

# Questions?

Please make an issue if you have questions, wish to request a feature, etc.
