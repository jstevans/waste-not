import configureLoadCache from "../lib/loadCache";

import * as ensureCacheFileExists from '../lib/utilities/ensureCacheFileExists';
import * as fs from '../lib/wrappers/fs';
import * as json from '../lib/wrappers/json';
import * as configureGetProperty from '../lib/getProperty';

describe("configureLoadCache", () => {
    it("returns a function", () => {
        const result = configureLoadCache(null as any);
        expect(typeof result).toBe("function");
    })
});

describe("loadCache", () => {

    const ensureCacheFileExistsSpy = jest.spyOn(ensureCacheFileExists, 'default');
    const readFileSyncSpy = jest.spyOn(fs, 'readFileSync');
    const jsonParseSpy = jest.spyOn(json, 'parse');
    const configureGetPropertySpy = jest.spyOn(configureGetProperty, 'default');
    const getMetadataSpy = jest.spyOn(configureGetProperty, 'getMetadata');

    let calls: any[] = [];

    const mockCacheFilePath = 'cacheFilePath';
    ensureCacheFileExistsSpy.mockImplementation(function (...args) {
        calls.push({ type: 'ensureCacheFileExists', args });
        return mockCacheFilePath;
    });

    const mockCacheFileContents = 'cacheFileContents';
    readFileSyncSpy.mockImplementation(function (...args) {
        calls.push({ type: 'readFileSync', args });
        return mockCacheFileContents;
    });

    const mockParsedContents = 'parsedContents';
    jsonParseSpy.mockImplementation(function (...args) {
        calls.push({ type: 'jsonParse', args });
        return mockParsedContents;
    });

    const mockGetProperty = jest.fn();
    configureGetPropertySpy.mockImplementation(function (...args) {
        calls.push({ type: 'configureGetProperty', args });
        return mockGetProperty;
    });

    const mockMetadataValue = {};
    const mockMetadata = {get: jest.fn(() => mockMetadataValue), commit: jest.fn()}
    getMetadataSpy.mockImplementation(function (...args) {
        calls.push({ type: 'getMetadata', args });
        return mockMetadata;
    });

    const mockContext = {
        rootPath: 'rootPath',
        cacheDirPath: 'cacheDirPath',
        isPropertyDirty: jest.fn(),
        setPropertyClean: jest.fn()
    }

    const mockFileRelativePath = 'fileRelativePath';
    const mockCacheOptions = {};
    const result = configureLoadCache(mockContext)(mockFileRelativePath, mockCacheOptions);

    describe("1) calls ensureCacheFileExists", () => {
        it("in the right order", () => {
            expect(calls[0].type).toBe('ensureCacheFileExists');
        })
        it("with the correct params", () => {
            expect(calls[0].args).toEqual([
                mockContext.cacheDirPath,
                mockFileRelativePath
            ])
        })
    })

    describe("2) calls readFileSync", () => {
        it("in the right order", () => {
            expect(calls[1].type).toBe('readFileSync');
        })
        it("with the correct params", () => {
            expect(calls[1].args).toEqual([
                mockCacheFilePath,
                { encoding: 'utf8' }
            ])
        })
    })
    
    describe("3) calls json.parse", () => {
        it("in the right order", () => {
            expect(calls[2].type).toBe('jsonParse');
        })
        it("with the correct params", () => {
            expect(calls[2].args).toEqual([
                mockCacheFileContents
            ])
        })
    })

    describe("4) calls getMetadata", () => {
        it("in the right order", () => {
            expect(calls[3].type).toBe('getMetadata');
        })

        it("with the correct params", () => {
            expect(calls[3].args[0]).toEqual(mockParsedContents);
            expect(typeof calls[3].args[1]).toBe('function');
        })
    })

    describe("5) calls configureGetProperty", () => {
        it("in the right order", () => {
            expect(calls[4].type).toBe('configureGetProperty');
        })

        it("with the correct params", () => {
            expect(calls[4].args[0]).toEqual(mockContext);
            expect(calls[4].args[1]).toBe(mockMetadata);
            expect(calls[4].args[2]).toEqual(mockParsedContents);
            expect(calls[4].args[3]).toEqual(mockFileRelativePath);
        })

        it("with the last param as a custom function that calls writeFileSync", () => {
            const writeFileSyncSpy = jest.spyOn(fs, 'writeFileSync');
            writeFileSyncSpy.mockReturnValueOnce();

            let writeToDisk = calls[4].args[4];

            expect(fs.writeFileSync).not.toHaveBeenCalled();
            expect(typeof calls[4].args[4]).toEqual('function');

            let result = writeToDisk();

            expect(result).toBeFalsy();
            expect(fs.writeFileSync).toHaveBeenCalledTimes(1);
        })
    })

    it("returns the result of configureGetProperty", () => {
        expect(result.getProperty).toBe(mockGetProperty);
    })

    it("returns a getter/setter for metadata", () => {
        expect(result).toHaveProperty('metadata');
    })
})