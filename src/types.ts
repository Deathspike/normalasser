export interface Options {
  /**
   * Determines whether to check `.ass` files. Default: `false`.
   */
  checkSsa?: true;

  /**
   * The ISO 639-3 language code. Default: `eng`.
   */
  language: string;

  /**
   * The font size. Default: `normal`.
   */
  size: 'tiny' | 'small' | 'normal' | 'large' | 'huge';
}
