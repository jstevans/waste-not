import { createHash } from 'crypto';

export default function makeHash(algorithm: string, data: (string|Buffer)[]) {
    let hasher = createHash(algorithm);
    for(const datum of data) {
        hasher.update(datum);
    }
    return hasher.digest('base64');
}