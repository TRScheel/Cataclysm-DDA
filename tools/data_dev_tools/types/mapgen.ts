import {
    type PaletteFurnitureEntry,
    type PaletteTerrainEntry,
} from "./mapgen_palette";

// Root mapgen type
export type Mapgen = {
    type: "mapgen";
    method: "json";
    om_terrain: string | string[]; // Single or multiple terrains
    weight?: number; // Optional weight field
    object: MapgenObject;
};

// Mapgen object definition
export type MapgenObject = {
    fill_ter: string; // Terrain to fill the entire map
    rows: string[]; // Array of strings representing rows of the map
    palettes?: string[]; // Optional array of palette names
    terrain?: PaletteTerrainEntry; // Terrain mappings
    furniture?: PaletteFurnitureEntry; // Furniture mappings
    place_loot?: MapgenPlaceLoot[]; // Loot placement rules
    place_monsters?: MapgenPlaceMonsters[]; // Monster placement rules
    place_vehicles?: MapgenPlaceVehicles[]; // Vehicle placement rules
    place_nested?: MapgenPlaceNested[]; // Nested chunk placement
};

// Loot placement
export type MapgenPlaceLoot = {
    group?: string; // Loot group name
    item?: string; // Specific item
    x: number | [number, number]; // X coordinate or range
    y: number | [number, number]; // Y coordinate or range
    chance: number; // Spawn chance
    repeat?: number | [number, number]; // Repeat count or range
};

// Monster placement
export type MapgenPlaceMonsters = {
    monster: string; // Monster group name
    x?: number | [number, number]; // X coordinate or range
    y?: number | [number, number]; // Y coordinate or range
    chance?: number; // Spawn chance
};

// Vehicle placement
export type MapgenPlaceVehicles = {
    vehicle: string; // Vehicle type
    x: number; // X coordinate
    y: number; // Y coordinate
    chance: number; // Spawn chance
    fuel?: number; // Fuel percentage
    status?: number; // Vehicle status
    rotation?: number; // Vehicle rotation
};

// Nested chunk placement
export type MapgenPlaceNested = {
    chunks: string[]; // List of chunk names
    x: number; // X coordinate
    y: number; // Y coordinate
};
