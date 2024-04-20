export type Metadata = {
  streams?: Array<MetadataStream>;
};

export type MetadataStream = {
  codec_name: string;
  codec_type: string;
  index: number;
  disposition?: Record<string, number>;
  tags?: Record<string, string>;
};
