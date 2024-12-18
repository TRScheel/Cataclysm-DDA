<script setup lang="ts">
import { useFileWalker } from "@/composables/useFileWalker";
import { type Mapgen } from "@/types/mapgen";

const folderStructure = ref<null | unknown>(null);
const { loadFiles } = useFileWalker();

const loadFolderStructure = async () => {
    const relativePath = "json/mapgen"; // Path relative to "data"
    folderStructure.value = await loadFiles(relativePath);
};

const selectedJson = "house_garage.json";
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
};
</script>

<template>
    <div>
        Map Editor
        <div>
            <v-btn variant="tonal" @click="loadData"> Load Data </v-btn>
            <v-btn variant="tonal" @click="loadFolderStructure">
                Load Folders
            </v-btn>
        </div>
        <div>
            <mapgen v-if="data" v-for="mapgen in data" :mapgen-data="mapgen" />
        </div>
        <details>
            <summary>Debug</summary>
            <pre>
                {{ data }}
            </pre>
        </details>

        <details>
            <summary>Folder Structure</summary>
            <pre>{{ folderStructure }}</pre>
        </details>
    </div>
</template>

<style scoped></style>
