// Base types for overmap components
export type OvermapVision = {
    id: string;
    type: "oter_vision";
    levels: Array<{
        name: string;
        sym: string;
        color: string;
        looks_like?: string;
    }>;
};

export type OvermapSpecialLocation = {
    id: string;
    type: "special_location";
    description?: string;
};

export type OvermapLandUseCode = {
    id: string;
    type: "land_use_code";
    sym: string;
    color: string;
};

export type OvermapConnection = {
    id: string;
    type: "overmap_connection";
    connection: string;
};

export type OvermapMultiTileBuilding = {
    id: string;
    type: "multitile";
    parts: Array<{ id: string; x: number; y: number }>;
};

export type OvermapMapExtra = {
    id: string;
    type: "map_extra";
    weight?: number;
    occurrences?: { min: number; max: number };
};

export type OvermapTerrain = {
    id: string;
    type: "oter";
    symbol: string;
    color: string;
    connections?: string[];
};

export type OvermapSpecialFeature = {
    id: string;
    type: "overmap_special";
    occurrences: { min: number; max: number };
    terrain: Array<{ id: string; x: number; y: number }>;
};

export type OvermapMutableFeature = {
    id: string;
    type: "overmap_mutable";
    chunks: Array<{ id: string; connections: string[] }>;
};

// Union of all overmap types
export type OvermapObject =
    | OvermapVision
    | OvermapSpecialLocation
    | OvermapLandUseCode
    | OvermapConnection
    | OvermapMultiTileBuilding
    | OvermapMapExtra
    | OvermapTerrain
    | OvermapSpecialFeature
    | OvermapMutableFeature;
