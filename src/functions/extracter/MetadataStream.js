export class MetadataStream {
  /** @readonly @type {string | undefined} */
  codec_name;
  /** @readonly @type {string | undefined} */
  codec_type;
  /** @readonly @type {Record<string, number> | undefined} */
  disposition;
  /** @readonly @type {number | undefined} */
  index;
  /** @readonly @type {Record<string, string> | undefined} */
  tags;

  /** @param {Partial<MetadataStream>} stream */
  constructor(stream) {
    this.codec_name = stream.codec_name;
    this.codec_type = stream.codec_type;
    this.index = stream.index;
    this.disposition = stream.disposition;
    this.tags = stream.tags;
  }
}
