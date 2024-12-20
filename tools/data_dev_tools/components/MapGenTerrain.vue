<script setup lang="ts">
import useDataStore from "~/stores/data";
import useGfxStore from "~/stores/gfx";
import { type Mapgen } from "@/types/mapgen";

const dataStore = useDataStore();
const gfxStore = useGfxStore();

const props = defineProps<{
    mapgenData: Mapgen;
}>();

const flattenedPalette = computed(() =>
    dataStore.flattenPalette({
        paletteIds: props.mapgenData.object.palettes,
        terrain: props.mapgenData.object.terrain,
        furniture: props.mapgenData.object.furniture,
    })
);

const selectedParams = reactive<Record<string, string>>({});

const getTileId = (char: string): string => {
    const terrainEntryValue =
        flattenedPalette.value.terrain?.[char] ??
        flattenedPalette.value.furniture?.[char];

    if (typeof terrainEntryValue === "string") {
        return terrainEntryValue;
    } else if (Array.isArray(terrainEntryValue)) {
        const flattenedValues = Array.isArray(terrainEntryValue[0])
            ? terrainEntryValue.map(([value, probability]) => value)
            : terrainEntryValue;

        if (
            !!selectedParams[char] &&
            flattenedValues.includes(selectedParams[char])
        ) {
            return selectedParams[char];
        } else if (!!flattenedValues[0]) {
            return flattenedValues[0];
        }
    } else if (typeof terrainEntryValue === "object") {
        if (
            "switch" in terrainEntryValue &&
            typeof terrainEntryValue.switch === "object"
        ) {
            const cases = terrainEntryValue.cases;
            const { param, fallback } = terrainEntryValue.switch;

            if (!!cases && !!param) {
                const values =
                    flattenedPalette.value.parameters[
                        param
                    ]?.default?.distribution?.map(
                        ([value, probability]) => value
                    ) ?? [];

                if (
                    !!selectedParams[param] &&
                    values.includes(selectedParams[param])
                ) {
                    return selectedParams[param];
                } else if (!!cases[Object.keys(cases)[0]]) {
                    return cases[Object.keys(cases)[0]];
                }

                if (!!switchObj?.fallback) {
                    return switchObj.fallback;
                }
            }
        }

        if (
            !!terrainEntryValue.param &&
            Object.keys(flattenedPalette.value.parameters ?? {}).includes(
                terrainEntryValue.param
            )
        ) {
            const values =
                flattenedPalette.value.parameters[
                    terrainEntryValue.param
                ]?.default?.distribution?.map(
                    ([value, probability]) => value
                ) ?? [];
            const selectedParamValue = selectedParams[terrainEntryValue.param];

            if (!!selectedParamValue && values.includes(selectedParamValue)) {
                return selectedParamValue;
            } else if (!!values[0]) {
                return values[0];
            }
        }

        if (!!terrainEntryValue.fallback) {
            return terrainEntryValue.fallback;
        }
    }

    return "";
};

const tiles = reactive<{
    [key: string]: string;
}>({});

const tileBackgrounds = reactive<{
    [key: string]: string;
}>({});

const loadAllTileBackgrounds = async () => {
    for (const char of [
        ...Object.keys(flattenedPalette.value.terrain),
        ...Object.keys(flattenedPalette.value.furniture),
    ]) {
        tileBackgrounds[char] = await getTileBackground(char);
    }
};

const getTileBackground = async (char: string) => {
    const tileId =
        char === " " ? props.mapgenData.object.fill_ter : getTileId(char);

    tiles[char] = tileId;

    return await gfxStore.getTileIdBackgroundCss(tileId);
};

const tileCss = (char: string) => {
    return {
        background: tileBackgrounds[char],
    };
};

onMounted(() => {
    loadAllTileBackgrounds();
});

watch(
    () => [selectedParams, flattenedPalette.value],
    () => {
        loadAllTileBackgrounds();
    },
    { deep: true }
);
</script>

<template>
    <div class="mapgen-grid">
        <div
            v-for="(row, rowIndex) in mapgenData.object.rows"
            :key="rowIndex"
            class="mapgen-row"
        >
            <span
                v-for="(char, colIndex) in [...row]"
                :key="colIndex"
                class="mapgen-tile"
                :style="tileCss(char)"
            >
                {{ char }}
            </span>
        </div>
    </div>
    <div>
        <details>
            <summary>Debug</summary>
            <pre>{{ tileBackgrounds }}</pre>
            <pre>{{ tiles }}</pre>
        </details>
    </div>
</template>

<style scoped>
.mapgen-grid {
    display: inline-block;
    font-family: monospace;
    line-height: 1em;
}
.mapgen-row {
    display: flex;
}
.mapgen-tile {
    display: inline-block;
    width: 32px;
    height: 32px;
    text-align: center;
    border: 1px solid transparent;
    line-height: 1em;
}
</style>
