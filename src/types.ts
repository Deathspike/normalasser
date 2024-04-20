import * as app from '.';

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
   * The font size. Default: `normal`.
   */
  size?: app.features.normalizer.Size;
}
