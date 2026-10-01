import { MetadataStream } from "./MetadataStream.js";

export class Metadata {
  /** @param {Partial<Metadata>} metadata */
  constructor(metadata) {
    this.streams = metadata.streams?.map(
      (stream) => new MetadataStream(stream),
    );
  }

  /** @readonly @type {MetadataStream[] | undefined} */
  streams;
}
