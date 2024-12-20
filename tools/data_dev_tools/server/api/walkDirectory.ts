import { defineEventHandler } from "h3";
import { promises as fs } from "fs";
import path from "path";

// Define types for File and Folder
export interface File {
    type: "file";
    name: string;
}

export interface Folder {
    type: "folder";
    name: string;
    contents: (File | Folder)[];
}

export type FileSystemObject = File | Folder;

// Define the recursive file walker
const walkDirectory = async (dir: string) => {
    const dirents = await fs.readdir(dir, { withFileTypes: true });
    const results: FileSystemObject[] = [];

    for (const dirent of dirents) {
        const fullPath = path.join(dir, dirent.name);
        if (dirent.isDirectory()) {
            results.push({
                type: "folder",
                name: dirent.name,
                contents: await walkDirectory(fullPath),
            });
        } else {
            results.push({
                type: "file",
                name: dirent.name,
            });
        }
    }

    return results;
};

export default defineEventHandler(async (event) => {
    const query = getQuery(event);
    const requestedPath = query.path as string;

    const config = useRuntimeConfig();
    const baseDataDir = config.public.baseDir;
    const targetDir = path.join(baseDataDir, requestedPath || "");

    if (!targetDir.startsWith(baseDataDir)) {
        throw new Error("Access to this folder is not allowed.");
    }

    try {
        return await walkDirectory(targetDir);
    } catch (error) {
        console.error("Error walking directory:", error);
        return {
            error: "Failed to read directory",
            targetDir,
            baseDataDir,
            requestedPath,
        };
    }
});
