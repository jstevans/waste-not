import * as fs from '../lib/wrappers/fs';
import * as path from '../lib/wrappers/path';
import ensureCacheFileExists from '../lib/utilities/ensureCacheFileExists';
describe("ensureCacheFileExists", () => {
    let pathResolveSpy = jest.spyOn(path, 'resolve');
    let writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
    const calls: any[] = [];

    const mockResolvedPath = 'resolvedPath';
    pathResolveSpy.mockImplementation(function (...args) {
        calls.push({ type: 'pathResolve', args: [args] });
        return mockResolvedPath;
    });

    writeFileSyncSpy.mockImplementation(function (...args) {
        calls.push({ type: 'writeFileSync', args: [args] });
    });

    const mockCacheDirPath = 'cacheDirPath';
    const mockFileRelativePath = 'fileRelativePath';
    let result = ensureCacheFileExists(mockCacheDirPath, mockFileRelativePath);

    describe("1) calls path.resolve", () => {
        it("in the correct order", () => {
            expect(calls[0].type).toBe('pathResolve');
        })
        it("with the correct parameters", () => {
            expect(calls[0].args).toEqual([
                [
                    mockCacheDirPath,
                    mockFileRelativePath
                ]
            ]);
        })
    })

    describe("2) calls writeFileSync", () => {
        it("in the correct order", () => {
            expect(calls[1].type).toBe('writeFileSync');
        })
        it("with the correct parameters", () => { 
            expect(calls[1].args).toEqual([
                [
                    mockResolvedPath,
                    '{"metadata":{},"properties":{}}',
                    { flag: 'wx' }
                ]
            ])
        })
    })

    it("doesn't throw on errno -17", () => { 
        writeFileSyncSpy.mockImplementation(() => { throw {errno: -17} });
        const call = () => ensureCacheFileExists(mockCacheDirPath, mockFileRelativePath);
        expect(call).not.toThrow();
    });

    it("throws on errno !== -17", () => { 
        writeFileSyncSpy.mockImplementation(() => { throw {errno: -18} });
        const call = () => ensureCacheFileExists(mockCacheDirPath, mockFileRelativePath);
        expect(call).toThrow();
    });

    it("returns the resolved path", () => { 
        expect(result).toBe(mockResolvedPath);
    });
})