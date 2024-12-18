// Root mapgen type
export interface Mapgen {
    type: "mapgen";
    method: "json";
    om_terrain: string | string[]; // Single or multiple terrains
    weight?: number; // Optional weight field
    object: MapgenObject;
}

// Mapgen object definition
export interface MapgenObject {
    fill_ter: string; // Terrain to fill the entire map
    rows: string[]; // Array of strings representing rows of the map
    palettes?: string[]; // Optional array of palette names
    terrain?: Record<string, string | string[]>; // Terrain mappings
    furniture?: Record<string, string>; // Furniture mappings
    place_loot?: PlaceLoot[]; // Loot placement rules
    place_monsters?: PlaceMonsters[]; // Monster placement rules
    place_vehicles?: PlaceVehicles[]; // Vehicle placement rules
    place_nested?: PlaceNested[]; // Nested chunk placement
}

// Loot placement
export interface PlaceLoot {
    group?: string; // Loot group name
    item?: string; // Specific item
    x: number | [number, number]; // X coordinate or range
    y: number | [number, number]; // Y coordinate or range
    chance: number; // Spawn chance
    repeat?: number | [number, number]; // Repeat count or range
}

// Monster placement
export interface PlaceMonsters {
    monster: string; // Monster group name
    x?: number | [number, number]; // X coordinate or range
    y?: number | [number, number]; // Y coordinate or range
    chance?: number; // Spawn chance
}

// Vehicle placement
export interface PlaceVehicles {
    vehicle: string; // Vehicle type
    x: number; // X coordinate
    y: number; // Y coordinate
    chance: number; // Spawn chance
    fuel?: number; // Fuel percentage
    status?: number; // Vehicle status
    rotation?: number; // Vehicle rotation
}

// Nested chunk placement
export interface PlaceNested {
    chunks: string[]; // List of chunk names
    x: number; // X coordinate
    y: number; // Y coordinate
}
