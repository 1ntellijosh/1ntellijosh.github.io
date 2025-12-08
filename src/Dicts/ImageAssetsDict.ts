/**
 * Image assets dictionary - all image assets defined in one place
 * 
 * @since abstract--JP
 */

export interface ImageAsset {
  path: string;
  type: 'gif' | 'png' | 'jpg' | 'jpeg' | 'webp';
}

export interface ImageAssetItem {
  readonly [key: string]: ImageAsset;
}

export const ImageAssetsDict: ImageAssetItem = Object.freeze({
  ship_ast: {
    path: 'sprite sheets/ship_ast sprites.gif',
    type: 'gif',
  },
  eSprite: {
    path: 'sprite sheets/shipsheetparts2-highercontrast.PNG',
    type: 'png',
  },
} as const);