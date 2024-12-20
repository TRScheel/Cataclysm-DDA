export type RegionalMapSetting = {
    type: "region_settings";
    id: string;
    default_oter: string[];
    default_groundcover: Array<[string, number]>;
    region_terrain_and_furniture: RegionalMapSettingTerrainAndFurniture;
    river_scale: number;
    overmap_lake_settings: RegionalMapSettingLakeSettings;
    overmap_ocean_settings: RegionalMapSettingOceanSettings;
    overmap_ravine_settings: RegionalMapSettingRavineSettings;
    overmap_forest_settings: RegionalMapSettingForestSettings;
    overmap_connection_settings: RegionalMapSettingConnectionSettings;
    forest_mapgen_settings: RegionalMapSettingForestMapgen;
    forest_trail_settings: RegionalMapSettingForestTrailSettings;
    map_extras: RegionalMapSettingMapExtras;
    city: RegionalMapSettingCity;
    weather: RegionalMapSettingWeather;
    overmap_feature_flag_settings: RegionalMapSettingFeatureFlags;
};

export type RegionalMapSettingTerrainAndFurniture = {
    terrain: Record<string, Record<string, number>>;
    furniture: Record<string, Record<string, number>>;
};

export type RegionalMapSettingLakeSettings = {
    noise_threshold_lake: number;
    lake_size_min: number;
    lake_depth: number;
    shore_extendable_overmap_terrain: string[];
    shore_extendable_overmap_terrain_aliases: Array<{
        om_terrain: string;
        om_terrain_match_type: string;
        alias: string;
    }>;
};

export type RegionalMapSettingOceanSettings = {
    noise_threshold_ocean: number;
    ocean_size_min: number;
    ocean_depth: number;
    ocean_start_north: number;
    ocean_start_east: number;
    ocean_start_west: number;
    ocean_start_south: number;
    sandy_beach_width: number;
};

export type RegionalMapSettingRavineSettings = {
    num_ravines: number;
    ravine_width: number;
    ravine_range: number;
    ravine_depth: number;
};

export type RegionalMapSettingForestSettings = {
    noise_threshold_forest: number;
    noise_threshold_forest_thick: number;
    noise_threshold_swamp_adjacent_water: number;
    noise_threshold_swamp_isolated: number;
    river_floodplain_buffer_distance_min: number;
    river_floodplain_buffer_distance_max: number;
};

export type RegionalMapSettingConnectionSettings = {
    intra_city_road_connection: string;
    inter_city_road_connection: string;
    trail_connection: string;
    sewer_connection: string;
    subway_connection: string;
    rail_connection: string;
};

export type RegionalMapSettingForestMapgen = Record<
    string,
    {
        terrains: string[];
        sparseness_adjacency_factor: number;
        item_group: string;
        item_group_chance: number;
        item_spawn_iterations: number;
        clear_groundcover: boolean;
        groundcover: Record<string, number>;
        clear_components: boolean;
        components: Record<
            string,
            {
                sequence: number;
                chance: number;
                clear_types: boolean;
                types: Record<string, number>;
            }
        >;
        clear_terrain_furniture: boolean;
        terrain_furniture: Record<string, unknown>;
    }
>;

export type RegionalMapSettingForestTrailSettings = {
    chance: number;
    border_point_chance: number;
    minimum_forest_size: number;
    random_point_min: number;
    random_point_max: number;
    random_point_size_scalar: number;
    trailhead_chance: number;
    trailhead_road_distance: number;
    trailheads: Record<string, number>;
};

export type RegionalMapSettingMapExtras = Record<
    string,
    {
        chance: number;
        extras: Record<string, number>;
    }
>;

export type RegionalMapSettingCity = {
    shop_radius: number;
    shop_sigma: number;
    park_radius: number;
    park_sigma: number;
    houses: Record<string, number>;
    parks: Record<string, number>;
    shops: Record<string, number>;
};

export type RegionalMapSettingWeather = {
    base_temperature: number;
    base_humidity: number;
    base_pressure: number;
    base_wind: number;
    base_wind_distrib_peaks: number;
    base_wind_season_variation: number;
};

export type RegionalMapSettingFeatureFlags = {
    clear_blacklist: boolean;
    blacklist: string[];
    clear_whitelist: boolean;
    whitelist: string[];
};
