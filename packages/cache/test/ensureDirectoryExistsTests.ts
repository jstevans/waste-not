import * as fs from '../lib/wrappers/fs';
import ensureDirectoryExists from '../lib/utilities/ensureDirectoryExists';
describe("ensureDirectoryExists", () => {

    const existsSyncSpy = jest.spyOn(fs, 'existsSync');
    const mkdirSyncSpy = jest.spyOn(fs, 'mkdirSync');

    beforeEach(() => {
        existsSyncSpy.mockReset();
        mkdirSyncSpy.mockReset();
    })
    it("creates the directory if it doesn't exist", () => {
        existsSyncSpy.mockReturnValue(false);
        mkdirSyncSpy.mockImplementation(() => { });

        const mockPath = '';
        const result = ensureDirectoryExists(mockPath);

        expect(fs.existsSync).toHaveBeenCalledTimes(1);
        expect(fs.mkdirSync).toHaveBeenCalledTimes(1);
        expect(result).toBe(mockPath);
    })

    it("doesn't try to create the directory if it already exists", () => {
        existsSyncSpy.mockReturnValue(true);
        mkdirSyncSpy.mockImplementation(() => { });

        const mockPath = '';
        const result = ensureDirectoryExists(mockPath);

        expect(fs.existsSync).toHaveBeenCalledTimes(1);
        expect(fs.mkdirSync).not.toHaveBeenCalled();
        expect(result).toBe(mockPath);
    })
})