import { Import } from '@babel/types';
import visit from '../lib/ImportCallExpressionVisitor';
import { stringLiteral, identifier, callExpression } from '@babel/types';
import * as addDependency from '../lib/utils/addDependency';
import * as addWarning from '../lib/utils/addWarning';
import * as getStringPattern from '../lib/utils/getStringPattern';

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

        visit(importCall, null as any);

        expect(getStringPattern.default).toBeCalledTimes(1);
    })

    it('adds a dependency from an ImportExpression', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: []
        }));

        visit(importCall, null as any);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("test", null);
    })

    it('adds a dependency from an ImportExpression that returns a warning', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: ['warning']
        }));

        visit(importCall, null as any);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("test", null);
    })

    it('adds a warning from an ImportExpression that returns a warning', () => {
        const importCall = callExpression(makeImport(), [stringLiteral("foo")]);
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: "test",
            warnings: ['warning']
        }));

        visit(importCall, null as any);

        expect(addWarning.default).toBeCalledTimes(1);
        expect(addWarning.default).toBeCalledWith("warning", null);
    })

    it('ignores any other call expression', () => {
        const nonImportCall = callExpression(identifier("fah"), [stringLiteral("foo")]);

        visit(nonImportCall, null as any);

        expect(addDependency.default).toBeCalledTimes(0);
    })
})