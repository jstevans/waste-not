import * as ensureDirectoryExists from '../lib/utilities/ensureDirectoryExists';
import * as loadCache from '../lib/loadCache';
import initialize from '../lib/index';
describe('initialize', () => {
    const ensureDirectoryExistsSpy = jest.spyOn(ensureDirectoryExists, 'default');
    const loadCacheSpy = jest.spyOn(loadCache, 'default');

    const mockRootPath = 'mockRootPath';
    const mockCacheDir = 'mockCacheDir';
    const mockIsPropertyDirty = jest.fn();
    const mocksetPropertyClean = jest.fn();

    const mockDirectoryPath = 'mockDirectoryPath';

    const mockReturn = 'mockReturnValue';
    const calls: any = [];

    ensureDirectoryExistsSpy.mockImplementation(function (...args) {
        calls.push({ type: 'ensureDirectoryExists', args });
        return mockDirectoryPath;
    });

    loadCacheSpy.mockImplementation(function (...args) {
        calls.push({ type: 'loadCacheSpy', args });
        return mockReturn as any;
    });

    const result = initialize(mockRootPath, mockCacheDir, mockIsPropertyDirty, mocksetPropertyClean);

    describe('1) calls ensureDirectoryExists', () => {
        it('first', () => {
            expect(calls[0].type).toBe('ensureDirectoryExists');
            expect(calls[0].args).toEqual(ensureDirectoryExistsSpy.mock.calls[0]);
        })

        it('with the correct params', () => {
            expect(calls[0].args).toEqual([mockCacheDir]);
        })
    })

    describe('2) calls loadCache', () => {
        it('second', () => {
            expect(calls[1].type).toBe('loadCacheSpy');
            expect(calls[1].args).toEqual(loadCacheSpy.mock.calls[0]);
        })

        it('with the correct params', () => {
            expect(calls[1].args).toEqual(
                [
                    {
                        rootPath: mockRootPath,
                        cacheDirPath: mockCacheDir,
                        isPropertyDirty: mockIsPropertyDirty,
                        setPropertyClean: mocksetPropertyClean
                    }
                ]
            )
        })
    })

    it("returns the function returned by loadCache", () => {
        expect(result).toBe(mockReturn);
    })
})