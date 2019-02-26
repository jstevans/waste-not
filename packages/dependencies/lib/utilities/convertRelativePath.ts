import * as path from 'path';
import { pathIsRelative } from '../wrappers/typescript';
export default function convertRelativePath(relativePath: string, filePath: string) {
return pathIsRelative(relativePath) ? path.resolve(path.dirname(filePath), relativePath) : relativePath;
}