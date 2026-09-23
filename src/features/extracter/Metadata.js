import * as app from "./index.js";

export class Metadata {
  /** @param {Partial<Metadata>} metadata */
  constructor(metadata) {
    this.streams = metadata.streams?.map(
      (stream) => new app.MetadataStream(stream),
    );
  }

  /** @readonly @type {app.MetadataStream[] | undefined} */
  streams;
}
