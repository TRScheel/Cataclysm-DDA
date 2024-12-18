<script setup lang="ts">
import { type Mapgen } from "@/types/mapgen";

defineProps<{
    mapgenData: Mapgen;
}>();
</script>

<template>
    <div>
        <h3>Mapgen Viewer</h3>
        <div><strong>Type:</strong> {{ mapgenData.type }}</div>
        <div><strong>Method:</strong> {{ mapgenData.method }}</div>
        <div>
            <strong>OM Terrain:</strong>
            <pre>{{ mapgenData.om_terrain }}</pre>
        </div>
        <div>
            <strong>Weight:</strong>
            <span v-if="mapgenData.weight">{{ mapgenData.weight }}</span>
            <span v-else>No weight defined</span>
        </div>
        <div>
            <strong>Fill Terrain:</strong> {{ mapgenData.object.fill_ter }}
        </div>
        <div>
            <strong>Rows:</strong>
            <pre>{{ mapgenData.object.rows.join("\n") }}</pre>
        </div>
    </div>
</template>

<style scoped>
pre {
    white-space: pre-wrap;
    word-wrap: break-word;
    padding: 8px;
}
</style>
