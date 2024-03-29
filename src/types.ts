export interface Options {
  /**
   * Determines whether to check `.ass` files.
   */
  checkAss?: boolean;

  /**
   * Determines whether to force `.mkv` files.
   */
  forceMkv?: boolean;

  /**
   * The ISO 639-3 language code. Default: `eng`.
   */
  language: string;

  /**
   * The font size. Default: `normal`.
   */
  size: 'tiny' | 'small' | 'normal' | 'large' | 'huge';
}
