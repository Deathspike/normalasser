import path from "node:path";
import { ffprobeAsync } from "./utils/ffprobeAsync.js";
import { waitAsync } from "./utils/waitAsync.js";
import { Extractor } from "./Extractor.js";
import { ExtractorTracker } from "./ExtractorTracker.js";
import { Metadata } from "./Metadata.js";
import { MetadataStream } from "./MetadataStream.js";

export class ExtractorBuilder {
  /** @readonly @type {string[]} */
  #args;
  /** @readonly @type {string} */
  #fullPath;

  /** @param {string} fullPath */
  constructor(fullPath) {
    this.#args = ["-y", "-i", fullPath];
    this.#fullPath = fullPath;
  }

  async buildAsync() {
    await waitAsync(this.#fullPath);
    const { dir, name } = path.parse(this.#fullPath);
    const metadata = new Metadata(await ffprobeAsync(this.#fullPath));
    const outputPath = path.join(dir, `.${name}.normalasser`);
    const streamPath = path.join(outputPath, name);
    this.#parseStreams(streamPath, this.#getStreams(metadata.streams));
    return new Extractor(this.#args, name, dir, outputPath);
  }

  /** @param {MetadataStream[]} streams */
  #getStreams(streams = []) {
    return streams.slice().sort((a, b) => {
      const ad = a.disposition?.["default"] ?? 0;
      const ai = a.index ?? -1;
      const bd = b.disposition?.["default"] ?? 0;
      const bi = b.index ?? -1;
      return bd - ad || ai - bi;
    });
  }

  /**
   * @param {string} streamPath
   * @param {MetadataStream[]} streams
   */
  #parseStreams(streamPath, streams) {
    const tracker = new ExtractorTracker();
    for (const stream of streams) {
      if (stream.codec_type === "subtitle" && stream.codec_name === "ass") {
        this.#args.push("-map", `0:${stream.index}`);
        this.#args.push(streamPath + tracker.add(".ass", stream));
      }
    }
  }
}
