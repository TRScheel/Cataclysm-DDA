// GfxTileConfig Types
export type GfxTileConfig = {
    tile_info: GfxTileInfo[];
    "tiles-new": GfxFileInfo[];
};

export type GfxTileInfo = {
    width: number;
    height: number;
    file: string;
};

export type GfxFileInfo = {
    file: string;
    sprite_width: number;
    sprite_height: number;
    sprite_offset_x: number;
    sprite_offset_y: number;
    tiles: GfxTile[];
};

export type GfxTile = {
    id: string | string[];
    fg?: number | number[] | GfxTileSpriteInfo[];
    bg?: number | number[] | GfxTileSpriteInfo[];
    multi_tile?: boolean;
    animated?: boolean;
    rotates?: boolean;
    additional_tiles?: GfxAdditionalTile[];
};

export type GfxTileSpriteInfo = {
    weight: number;
    sprite: number;
};

export type GfxAdditionalTile = {
    id: string;
    fg: number | number[];
};

// GfxLayering Types
export type GfxLayeringConfig = {
    layering: GfxLayeringRule[];
};

export type GfxLayeringRule = {
    id: string;
    type: "layer";
    base?: string;
    overlays?: string[];
    order?: number;
};
