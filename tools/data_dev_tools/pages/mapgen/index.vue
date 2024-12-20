<script setup lang="ts">
import useDataStore from "~/stores/data";
import useGfxStore from "~/stores/gfx";

const dataStore = useDataStore();
const gfxStore = useGfxStore();

const selectedJson = "house01.json";
const selectedFolder = "house";

const data = ref<null | Mapgen[]>(null);

const loadData = async () => {
    const response = await fetch(
        `/data/json/mapgen/${selectedFolder}/${selectedJson}`
    );
    if (response.ok) {
        data.value = (await response.json()) as Mapgen[];
    } else {
        console.error("Failed to load JSON file");
    }

    await dataStore.reloadAll();
    await gfxStore.reloadTilesets();
    await gfxStore.loadTileset("Altica");
};

onMounted(() => {
    loadData();
});

const selectedTileset = computed({
    get() {
        return gfxStore.tilesetData.name;
    },
    set(value: string) {
        gfxStore.loadTileset(value);
    },
});

const paletteOptions = ref<unknown>({});

const testPaletteOptions = () => {
    paletteOptions.value = dataStore.flattenPalette({
        paletteIds: [
            "domestic_general_and_variant_palette",
            "standard_domestic_landscaping_palette",
            "standard_domestic_lino_bathroom",
        ],
    });
};
</script>

<template>
    <div>
        <div>Map Editor</div>
        <div>
            <v-select
                label="Tileset"
                :items="gfxStore.tilesets"
                v-model="selectedTileset"
            />
            <v-btn @click="testPaletteOptions">Test Palette Options</v-btn>
        </div>
        <map-gen-terrain v-if="data" :mapgenData="data[0]" />
        <div>
            <details>
                <summary>Debug</summary>
                <pre>{{ dataStore.regionalMapSettings }}</pre>
            </details>
        </div>
    </div>
</template>

<style scoped></style>
