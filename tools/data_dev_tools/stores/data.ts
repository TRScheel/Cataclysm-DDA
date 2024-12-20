import { defineStore } from "pinia";
import { useFileWalker } from "@/composables/useFileWalker";
import {
    type OvermapObject,
    type Mapgen,
    type Palette,
    type PaletteDistribution,
    type PaletteTerrainEntry,
    type PaletteFurnitureEntry,
    type RegionalMapSetting,
} from "@/types";

const storeKey = "data";

const useStore = defineStore(storeKey, {
    state: () => {
        return {
            palettes: [] as Palette[],
            mapgens: [] as Mapgen[],
            overmaps: [] as OvermapObject[],
            regionalMapSettings: [] as RegionalMapSetting[],
        };
    },
    getters: {
        getPaletteOptions:
            (state) =>
            (
                paletteId: string
            ): Record<string, PaletteDistribution<string>> => {
                const resolved: Record<
                    string,
                    PaletteDistribution<string>
                > = {};

                const checked = new Set<string>();

                const resolvePalette = (id: string) => {
                    if (checked.has(id)) return;
                    else checked.add(id);

                    const palette = state.palettes.find((p) => p.id === id);
                    if (!palette) return;

                    // Resolve parameters
                    if (palette.parameters) {
                        for (const [param, paramData] of Object.entries(
                            palette.parameters
                        ).filter(
                            ([param, paramData]) =>
                                paramData.type === "palette_id"
                        )) {
                            resolved[param] = paramData.default.distribution;
                            for (const [childId] of paramData.default
                                .distribution) {
                                resolvePalette(childId);
                            }
                        }
                    }

                    // Resolve nested palettes
                    if (palette.palettes) {
                        palette.palettes
                            .filter((p) => typeof p === "string")
                            .forEach(resolvePalette);
                    }
                };

                resolvePalette(paletteId);
                return resolved;
            },
        flattenPalette:
            (state) =>
            ({
                paletteIds,
                paletteOptions = {},
                terrain = {},
                furniture = {},
            }: {
                paletteIds: string[];
                paletteOptions?: Record<string, string>;
                terrain?: PaletteTerrainEntry;
                furniture?: PaletteFurnitureEntry;
            }): Omit<Palette, "type" | "id" | "palettes"> => {
                const mergedPalette: Omit<Palette, "type" | "id" | "palettes"> =
                    {
                        terrain: {},
                        furniture: {},
                        items: {},
                        liquids: {},
                        nested: {},
                        mapping: {},
                        toilets: {},
                        parameters: {},
                    };

                const palettesChecked = new Set<string>();

                const resolvePalette = (id: string) => {
                    if (!palettesChecked.has(id)) palettesChecked.add(id);

                    const palette = state.palettes.find((p) => p.id === id);
                    if (!palette) {
                        console.error(`Palette not found: ${id}`);
                        return;
                    }

                    // Process palettes recursively
                    if (palette.palettes) {
                        palette.palettes.forEach((p) => {
                            if (typeof p === "string") {
                                resolvePalette(p);
                            } else if (paletteOptions[p.param]) {
                                resolvePalette(p.param);
                            } else {
                                const selectedOption =
                                    palette.parameters?.[p.param]?.default
                                        ?.distribution[0]?.[0] ?? null;
                                if (selectedOption)
                                    resolvePalette(selectedOption);
                            }
                        });
                    }

                    // Merge properties back up
                    Object.assign(
                        mergedPalette.terrain ?? {},
                        palette.terrain,
                        terrain
                    );
                    Object.assign(
                        mergedPalette.furniture ?? {},
                        palette.furniture,
                        furniture
                    );
                    Object.assign(mergedPalette.items ?? {}, palette.items);
                    Object.assign(mergedPalette.liquids ?? {}, palette.liquids);
                    Object.assign(mergedPalette.nested ?? {}, palette.nested);
                    Object.assign(mergedPalette.mapping ?? {}, palette.mapping);
                    Object.assign(mergedPalette.toilets ?? {}, palette.toilets);
                    Object.assign(
                        mergedPalette.parameters ?? {},
                        Object.fromEntries(
                            Object.entries(palette.parameters ?? {}).filter(
                                ([, param]) => param.type !== "palette_id"
                            )
                        )
                    );
                };

                paletteIds.forEach(resolvePalette);

                console.log(palettesChecked);
                return mergedPalette;
            },
    },
    actions: {
        // TODO: These should validate the loaded data before
        // setting it to the store.
        async reloadPalettes() {
            const { loadAllFilesToJson } = useFileWalker();
            const relativePath = "data/json/mapgen_palettes";
            this.palettes = (await loadAllFilesToJson(
                relativePath
            )) as Palette[];
        },
        async reloadMapgens() {
            const { loadAllFilesToJson } = useFileWalker();
            const relativePath = "data/json/mapgen";
            this.mapgens = (await loadAllFilesToJson(relativePath)) as Mapgen[];
        },
        async reloadOvermaps() {
            const { loadAllFilesToJson } = useFileWalker();
            const relativePath = "data/json/overmap";
            this.overmaps = (await loadAllFilesToJson(
                relativePath
            )) as OvermapObject[];
        },
        async reloadRegionalMapSettings() {
            const { loadFileToJson } = useFileWalker();
            const relativePath = "data/json/regional_map_settings.json";
            this.regionalMapSettings = (await loadFileToJson(
                relativePath
            )) as RegionalMapSetting[];
        },
        async reloadAll() {
            await Promise.all([
                this.reloadPalettes(),
                this.reloadMapgens(),
                this.reloadOvermaps(),
                this.reloadRegionalMapSettings(),
            ]);
        },
    },
    persist: {
        afterHydrate: (ctx) => {
            if (import.meta.client) {
                window?.addEventListener("storage", ({ key }) => {
                    if (key !== storeKey) return;
                    ctx.store.$hydrate({ runHooks: false });
                });
            }
        },
    },
});

export default useStore;
