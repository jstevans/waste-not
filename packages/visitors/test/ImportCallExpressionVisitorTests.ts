import { Import } from '@babel/types';
import visit from 'visitors/ImportCallExpressionVisitor';
import { stringLiteral, identifier, callExpression } from '@babel/types';
import * as addDependency from 'visitors/utils/addDependency';
import * as addWarning from 'visitors/utils/addWarning';
import * as getStringPattern from 'visitors/utils/getStringPattern';

describe('ImportDeclarationVisitor', () => {
    const makeImport = () => ({type: "Import" } as Import);
    beforeEach(() => {
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: '',
            warnings: []
        })).mockClear();
        jest.spyOn(addDependency, 'default').mockImplementation().mockClear();
        jest.spyOn(addWarning, 'default').mockImplementation().mockClear();
    })

    it('calls getStringPattern for an ImportExpression', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);

        visit(importCall, null);

        expect(getStringPattern.default).toBeCalledTimes(1);
    })

    it('adds a dependency from an ImportExpression', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: []
        }));

        visit(importCall, null);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("test", null);
    })

    it('adds a dependency from an ImportExpression that returns a warning', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: ['warning']
        }));

        visit(importCall, null);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("test", null);
    })

    it('adds a warning from an ImportExpression that returns a warning', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: ['warning']
        }));

        visit(importCall, null);

        expect(addWarning.default).toBeCalledTimes(1);
        expect(addWarning.default).toBeCalledWith("warning", null);
    })

    it('ignores any other call expression', () => {
        const nonImportCall = callExpression(identifier("fah"), [stringLiteral("foo")]);

        visit(nonImportCall, null);

        expect(addDependency.default).toBeCalledTimes(0);
    })
})