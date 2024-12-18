import { type FileSystemObject } from "~/server/api/walkDirectory";

export const useFileWalker = () => {
    const loadFiles = async (
        relativePath: string
    ): Promise<FileSystemObject[] | null> => {
        try {
            const response = await fetch(
                `/api/walkDirectory?path=${encodeURIComponent(relativePath)}`
            );
            if (!response.ok)
                throw new Error("Failed to load folder structure.");
            return await response.json();
        } catch (error) {
            console.error("Error fetching folder structure:", error);
            return null;
        }
    };

    return { loadFiles };
};
