import { existsSync, mkdirSync } from "../wrappers/fs";

export default function ensureDirectoryExists(path: string) {
    if(!existsSync(path)) {
        mkdirSync(path, { recursive: true });
    }

    return path;
}