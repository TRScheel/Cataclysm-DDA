import { type FileSystemObject } from "~/server/api/walkDirectory";

export const useFileWalker = () => {
    const loadFiles = async (
        relativePath: string
    ): Promise<FileSystemObject[]> => {
        try {
            const response = await fetch(
                `/api/walkDirectory?path=${encodeURIComponent(relativePath)}`
            );
            if (!response.ok)
                throw new Error("Failed to load folder structure.");
            return await response.json();
        } catch (error) {
            console.error("Error fetching folder structure:", error);
            return [];
        }
    };

    const loadAllFilesToJson = async (
        relativePath: string
    ): Promise<unknown[]> => {
        try {
            // Walk the folder structure
            const folderStructure = await loadFiles(relativePath);
            if (!folderStructure) {
                console.error("Failed to load folder structure.");
                return [];
            }

            // Collect file paths for all .json files
            const jsonFiles: string[] = [];
            const collectJsonFiles = (
                entries: FileSystemObject[],
                basePath: string
            ) => {
                for (const entry of entries) {
                    if (entry.type === "file" && entry.name.endsWith(".json")) {
                        jsonFiles.push(`${basePath}/${entry.name}`);
                    } else if (entry.type === "folder") {
                        collectJsonFiles(
                            entry.contents,
                            `${basePath}/${entry.name}`
                        );
                    }
                }
            };
            collectJsonFiles(folderStructure, relativePath);

            // Fetch and load each JSON file
            const loadedJsons: unknown[] = [];
            for (const filePath of jsonFiles) {
                const jsonData = await loadFileToJson(filePath);

                // Append the palettes found in the JSON file
                if (Array.isArray(jsonData)) {
                    loadedJsons.push(...jsonData);
                } else if (typeof jsonData === "object") {
                    loadedJsons.push(jsonData);
                }
            }

            // Return the results
            return loadedJsons;
        } catch (error) {
            console.error("Failed to reload palettes:", error);
            return [];
        }
    };

    const loadFileToJson = async (filePath: string): Promise<unknown> => {
        const response = await fetch(`/${filePath}`);
        if (response.ok) {
            return await response.json();
        } else {
            console.error(`Failed to load file: ${filePath}`);
        }
    };

    return { loadFiles, loadAllFilesToJson, loadFileToJson };
};
