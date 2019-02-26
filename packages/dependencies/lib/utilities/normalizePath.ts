import * as path from 'path';

export default function normalizePath(pathString: string) {
   return path.relative(process.cwd(), path.resolve(pathString));
}