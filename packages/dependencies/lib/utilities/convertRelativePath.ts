import * as path from 'path';
import { pathIsRelative } from '../wrappers/typescript';
export default function convertRelativePath(relativePath: string, filePath: string, newBasePath: string) {
return path.relative(newBasePath, pathIsRelative(relativePath) ? path.resolve(path.dirname(filePath), relativePath) : relativePath);
}