import * as babelParse from '@babel/parser';
import parse from '../lib/wrappers/babelParse';
describe('parse', () => {
    const mockReturnValue: any = 'asdf';
    beforeEach(() => {
        jest.spyOn(babelParse, 'parse').mockReturnValue(mockReturnValue);
    })
    describe('returns @babel/parse', () => {
        it('for js', () => {
            expect(parse('testFile.js', 'test file contents')).toEqual(mockReturnValue);
        })

        it('for jsx', () => {
            expect(parse('testFile.jsx', 'test file contents')).toEqual(mockReturnValue);
        })

        it('for d.ts', () => {
            expect(parse('testFile.d.ts', 'test file contents')).toEqual(mockReturnValue);
        })

        it('for ts', () => {
            expect(parse('testFile.ts', 'test file contents')).toEqual(mockReturnValue);
        })

        it('for tsx', () => {
            expect(parse('testFile.tsx', 'test file contents')).toEqual(mockReturnValue);
        })
    })

    describe('returns falsy', () => {
        it('for css', () => {
            expect(parse('testFile.css', 'test file contents')).toBeFalsy();
        })

        it('for txt', () => {
            expect(parse('testFile.txt', 'test file contents')).toBeFalsy();
        })

        it('for no extension', () => {
            expect(parse('testFile', 'test file contents')).toBeFalsy();
        })

        it('for md', () => {
            expect(parse('testFile.md', 'test file contents')).toBeFalsy();
        })
    })
});