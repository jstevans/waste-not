import configureGetProperty from "../lib/getProperty";

const mockContext = {
    rootPath: 'rootPath',
    cacheDirPath: 'cacheDirPath',
    isPropertyDirty: jest.fn(),
    setPropertyClean: jest.fn()
}

const mockFileRelativePath = 'fileRelativePath';
const mockPropertyKey = 'property';
const mockProperty = { value: { key1: 'propertyValue' } };
const mockGetMetadata = { get: jest.fn(), commit: jest.fn() };
const mockCacheFile = { metadata: {}, properties: { [mockPropertyKey]: mockProperty } };

const mockPropertyOptions = {};

const mockWriteToDisk = jest.fn();

const getProperty = configureGetProperty(mockContext, mockGetMetadata, mockCacheFile, mockFileRelativePath, mockWriteToDisk);

beforeEach(() => {
    jest.resetAllMocks();
    mockContext.isPropertyDirty.mockReset();
    mockContext.setPropertyClean.mockReset();
    mockWriteToDisk.mockReset();
});

describe("configureGetProperty", () => {
    it("returns a function", () => {
        expect(typeof getProperty).toBe("function");
    })
});

describe("getProperty", () => {
    const result = getProperty(mockPropertyKey, mockPropertyOptions);

    it("returns an object", () => {
        expect(typeof result).toEqual("object");
    });

    describe(".isDirty", () => {
        it("exists on the return value of getProperty", () => {
            expect(result).toHaveProperty("isDirty");
        })

        it("calls isPropertyDirty on context when called", () => {
            result.isDirty();
            expect(mockContext.isPropertyDirty).toHaveBeenCalledTimes(1);
            expect(mockContext.isPropertyDirty).lastCalledWith(
                mockProperty,
                mockGetMetadata,
                {
                    cacheDirPath: mockContext.cacheDirPath,
                    fileRelativePath: mockFileRelativePath,
                    rootPath: mockContext.rootPath
                },
                mockPropertyOptions);
        })
    })

    describe(".read", () => {
        it("exists on the return value of getProperty", () => {
            expect(result).toHaveProperty("read");
        })

        it("returns a copy cacheProperty.value on context when called", () => {
            const resultPropertyValue = result.read();
            expect(resultPropertyValue).toEqual(mockProperty.value);
            expect(resultPropertyValue).not.toBe(mockProperty.value);
        })
    })

    describe(".write", () => {
        it("exists on the return value of getProperty", () => {
            expect(result).toHaveProperty("write");
        })

        describe("when called", () => {
            it("sets cacheProperty.value to a copy of the new value", () => {
                const mockWriteValue = { key1: 'writeValue' };
                result.write(mockWriteValue);
                expect(mockProperty.value).toEqual(mockWriteValue);
                expect(mockProperty.value).not.toBe(mockWriteValue);
            })

            it("calls setPropertyClean with the correct params", () => {
                const mockWriteValue = { key1: 'writeValue' };
                result.write(mockWriteValue);
                expect(mockContext.setPropertyClean).toHaveBeenCalledWith(
                    mockProperty,
                    mockGetMetadata,
                    {
                        cacheDirPath: mockContext.cacheDirPath,
                        fileRelativePath: mockFileRelativePath,
                        rootPath: mockContext.rootPath
                    },
                    mockPropertyOptions
                )
            })

            it("calls writeToDisk", () => {
                const mockWriteValue = { key1: 'writeValue' };
                result.write(mockWriteValue);
                expect(mockWriteToDisk).toHaveBeenCalled();
            })
        })
    })
});