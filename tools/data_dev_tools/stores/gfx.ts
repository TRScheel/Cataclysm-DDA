import { defineStore } from "pinia";
import { useFileWalker } from "@/composables/useFileWalker";
import {
    type GfxTileConfig,
    type GfxLayeringConfig,
    type GfxTile,
    type GfxTileSpriteInfo,
    type GfxFileInfo,
} from "@/types";

const storeKey = "gfx";

const emptyTilesetData: GfxTileConfig = {
    tile_info: [],
    "tiles-new": [],
};

const emptyLayeringData: GfxLayeringConfig = {
    layering: [],
};

export type GfxTileset = {
    name: string;
    tileConfig: GfxTileConfig;
    layeringConfig: GfxLayeringConfig;
    imageCache: Record<string, { width: number; height: number }>;
    tileIdCache: Record<string, string>;
    fileMinFg: Record<string, number>;
};

const emptyGfxTileset: GfxTileset = {
    name: "",
    tileConfig: emptyTilesetData,
    layeringConfig: emptyLayeringData,
    imageCache: {},
    tileIdCache: {},
    fileMinFg: {},
};

const useStore = defineStore(storeKey, {
    state: () => {
        return {
            tilesetData: emptyGfxTileset as GfxTileset,
            tilesets: [] as string[],
        };
    },
    getters: {
        getTileIdBackgroundCss: (state) => (id: string) => {
            return state.tilesetData.tileIdCache[id] ?? "unset";
        },
    },
    actions: {
        async reloadTilesets() {
            const { loadFiles } = useFileWalker();
            const fileSystemObjects = await loadFiles("gfx");
            if (!fileSystemObjects) {
                console.error("Failed to load tilesets.");
                return;
            }

            // TODO: Ensure we only get root folders
            this.tilesets = fileSystemObjects
                .filter((entry) => entry.type === "folder")
                .map((entry) => entry.name);
        },
        async loadTileset(name: string) {
            if (this.tilesets.length === 0) {
                await this.reloadTilesets();
            }

            if (!this.tilesets.includes(name) && name !== "") {
                console.error("Invalid tileset name.");
                return;
            }

            const { loadFiles } = useFileWalker();
            const filePath = `gfx/${name}`;
            const fileSystemObjects = await loadFiles(filePath);

            if (!fileSystemObjects) {
                console.error("Failed to load tileset.");
                return;
            }

            const tileConfigFSO = fileSystemObjects.find(
                (entry) => entry.name === "tile_config.json"
            );

            if (!tileConfigFSO) {
                console.error("Failed to load tileset configuration.");
                return;
            }

            const layeringConfigFSO = fileSystemObjects.find(
                (entry) => entry.name === "layering.json"
            );

            const tileConfig = (await (
                await fetch(`/${filePath}/${tileConfigFSO.name}`)
            ).json()) as GfxTileConfig;

            const layeringConfig = !!layeringConfigFSO
                ? ((await (
                      await fetch(`/${filePath}/${layeringConfigFSO.name}`)
                  ).json()) as GfxLayeringConfig)
                : emptyLayeringData;

            const imageCache = {} as Record<
                string,
                { width: number; height: number }
            >;
            await Promise.all(
                this.tilesetData.tileConfig["tiles-new"].map(async (file) => {
                    const filePath = `/gfx/${this.tilesetData.name}/${file.file}`;

                    return new Promise((resolve) => {
                        const img = new Image();
                        img.src = filePath;
                        img.onload = () => {
                            imageCache[file.file] = {
                                width: img.width,
                                height: img.height,
                            };
                            resolve(imageCache[file.file]);
                        };
                    });
                })
            );

            const getIndex = (
                indexer: number | number[] | GfxTileSpriteInfo[] | undefined
            ) => {
                if (indexer === undefined) return;

                if (Array.isArray(indexer)) {
                    if (indexer.length === 0) return;

                    if (typeof indexer[0] === "number") {
                        return indexer[0];
                    }

                    return indexer[0].sprite;
                }

                return indexer;
            };
            const fileMinFg = {} as Record<string, number>;
            this.tilesetData.tileConfig["tiles-new"].forEach((file) => {
                const baseIndex = Math.min(
                    ...file.tiles
                        .map((tile) => getIndex(tile.fg) ?? -1)
                        .filter((index) => index !== -1),
                    ...file.tiles
                        .map((tile) => getIndex(tile.bg) ?? -1)
                        .filter((index) => index !== -1)
                );
                fileMinFg[file.file] = baseIndex;
            });

            const tileIdCache = {} as Record<string, string>;
            const calculateBackgroundImage = (
                tile: GfxTile,
                file: GfxFileInfo
            ) => {
                if (imageCache[file.file] === undefined) return "unset";
                const { width: imgWidth, height: imgHeight } =
                    imageCache[file.file];

                const buildBackgroundCss = (index: number | undefined) => {
                    if (index === undefined) return;
                    const adjustedIndex = index - fileMinFg[file.file];
                    const width =
                        file.sprite_width ??
                        this.tilesetData.tileConfig.tile_info[0].width ??
                        32;

                    const height =
                        file.sprite_height ??
                        this.tilesetData.tileConfig.tile_info[0].height ??
                        32;

                    const columns = Math.floor(imgWidth / width);
                    const x = (adjustedIndex % columns) * width;
                    const y = Math.floor(adjustedIndex / columns) * height;

                    return `url('/gfx/${this.tilesetData.name}/${file.file}') -${x}px -${y}px / auto no-repeat`;
                };

                const fg = getIndex(tile.fg);
                const bg = getIndex(tile.bg);

                const fgCss = buildBackgroundCss(fg);
                const bgCss = buildBackgroundCss(bg);
                if (!fgCss && !bgCss) return "unset";
                if (!!fgCss) return fgCss;
                if (!!bgCss) return bgCss;

                return `${bgCss}, ${fgCss}`;
            };

            this.tilesetData.tileConfig["tiles-new"].forEach((file) => {
                file.tiles.forEach((tile) => {
                    if (Array.isArray(tile.id)) {
                        const backgroundCss = calculateBackgroundImage(
                            tile,
                            file
                        );
                        tile.id.forEach((id) => {
                            tileIdCache[id] = backgroundCss;
                        });
                    } else {
                        tileIdCache[tile.id] = calculateBackgroundImage(
                            tile,
                            file
                        );
                    }
                });
            });

            this.tilesetData = {
                name,
                tileConfig,
                layeringConfig,
                imageCache,
                tileIdCache,
                fileMinFg,
            };
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
