export type PaletteDictionary<T> = { [key: string]: T };

export type PaletteDistribution<T> = Array<[T, number]>;

export type PaletteNestedChunk = {
    chunks: Array<[string, number]>;
};

export type PaletteParameter = {
    type: string;
    scope?: string;
    default: { distribution: PaletteDistribution<string> };
    fallback?: string;
};

export type PaletteFurnitureEntry = {
    [symbol: string]: PaletteTerrainEntryValue;
};

export type PaletteTerrainEntry = {
    [symbol: string]: PaletteTerrainEntryValue;
};

export type PaletteTerrainEntryParamFallback = {
    param: string;
    fallback?: string;
};

export type PaletteTerrainEntryValue =
    | string
    | PaletteTerrainEntryParamFallback
    | {
          switch: PaletteTerrainEntryParamFallback;
          cases: PaletteDictionary<string>;
      }
    | PaletteDistribution<string>
    | string[];

export type PaletteItemEntry = {
    [symbol: string]:
        | {
              item: string;
              chance: number;
              repeat?: [number, number];
              ammo?: number;
              magazine?: number;
          }
        | Array<{
              item: string;
              chance: number;
              repeat?: [number, number];
              ammo?: number;
              magazine?: number;
          }>;
};

export type PaletteLiquidEntry = {
    [symbol: string]: {
        liquid: string;
        amount: [number, number];
    };
};

export type PaletteNestedEntry = {
    [symbol: string]: PaletteNestedChunk;
};

export type PaletteMappingEntry = {
    [symbol: string]: { item: { item: string; chance: number } };
};

export type PaletteToiletEntry = {
    [symbol: string]: unknown;
};

export type Palette = {
    type: "palette";
    id: string;
    palettes?: (string | { param: string })[];
    parameters?: PaletteDictionary<PaletteParameter>;
    terrain?: PaletteTerrainEntry;
    furniture?: PaletteFurnitureEntry;
    items?: PaletteItemEntry;
    liquids?: PaletteLiquidEntry;
    nested?: PaletteNestedEntry;
    mapping?: PaletteMappingEntry;
    toilets?: PaletteToiletEntry;
};
