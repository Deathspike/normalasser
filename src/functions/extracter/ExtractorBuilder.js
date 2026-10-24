import path from "node:path";

import { Extractor } from "./Extractor.js";
import { ExtractorTracker } from "./ExtractorTracker.js";
import { Metadata } from "./Metadata.js";
import { MetadataStream } from "./MetadataStream.js";
import { waitAsync } from "./utils/waitAsync.js";

export class ExtractorBuilder {
  /** @readonly @type {string[]} */
  #args;
  /** @readonly @type {string} */
  #filePath;

  /** @param {string} filePath */
  constructor(filePath) {
    this.#args = ["-y", "-i", filePath];
    this.#filePath = filePath;
  }

  async buildAsync() {
    await waitAsync(this.#filePath);
    const { dir, name } = path.parse(this.#filePath);
    const metadata = await Metadata.ffprobeAsync(this.#filePath);
    const outputPath = path.join(dir, `.${name}.normalasser`);
    const streamPath = path.join(outputPath, name);
    this.#parseStreams(streamPath, this.#getStreams(metadata.streams));
    return new Extractor(this.#args, name, dir, outputPath);
  }

  /** @param {MetadataStream[]} streams */
  #getStreams(streams = []) {
    return streams.slice().toSorted((a, b) => {
      const defaultA = a.disposition?.["default"] ?? 0;
      const defaultB = b.disposition?.["default"] ?? 0;
      const indexA = a.index ?? -1;
      const indexB = b.index ?? -1;
      return defaultB - defaultA || indexA - indexB;
    });
  }

  /**
   * @param {string} streamPath
   * @param {MetadataStream[]} streams
   */
  #parseStreams(streamPath, streams) {
    const tracker = new ExtractorTracker();
    for (const stream of streams) {
      if (isAssSubtitle(stream) && stream.index !== undefined) {
        const map = `0:${stream.index.toString()}`;
        const extension = tracker.add(".ass", stream);
        this.#args.push("-map", map, streamPath + extension);
      }
    }
  }
}

/** @param {MetadataStream} stream */
function isAssSubtitle(stream) {
  return stream.codec_type === "subtitle" && stream.codec_name === "ass";
}
