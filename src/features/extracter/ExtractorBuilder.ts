import * as app from '.';
import * as path from 'node:path';
import {ffprobeAsync} from './utils/ffprobeAsync';
import {waitAsync} from './utils/waitAsync';

export class ExtractorBuilder {
  private readonly args: Array<string>;
  private readonly fullPath: string;

  constructor(fullPath: string) {
    this.args = ['-y', '-i', fullPath];
    this.fullPath = fullPath;
  }

  async buildAsync() {
    await waitAsync(this.fullPath);
    const {dir, name} = path.parse(this.fullPath);
    const metadata = await ffprobeAsync(this.fullPath);
    const outputPath = path.join(dir, `.${name}.normalasser`);
    const streamPath = path.join(outputPath, name);
    this.parseStreams(streamPath, this.getStreams(metadata.streams));
    return new app.Extractor(this.args, name, dir, outputPath);
  }

  private getStreams(streams: Array<app.MetadataStream> = []) {
    return streams.slice().sort((a, b) => {
      const ad = a.disposition?.['default'] ?? 0;
      const ai = a.index;
      const bd = b.disposition?.['default'] ?? 0;
      const bi = b.index;
      return bd - ad || ai - bi;
    });
  }

  private parseStreams(streamPath: string, streams: Array<app.MetadataStream>) {
    const tracker = new app.ExtractorTracker();
    for (const stream of streams) {
      if (stream.codec_type === 'subtitle' && stream.codec_name === 'ass') {
        this.args.push('-map', `0:${stream.index}`);
        this.args.push(streamPath + tracker.add('.ass', stream));
      }
    }
  }
}
