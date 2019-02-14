import { Import, memberExpression } from '@babel/types';
import visit from 'visitors/SingleModuleRequireCallExpressionVisitor';
import { stringLiteral, identifier, callExpression } from '@babel/types';
import * as addDependency from 'visitors/utils/addDependency';
import * as addWarning from 'visitors/utils/addWarning';
import * as getStringPattern from 'visitors/utils/getStringPattern';

describe('SingleModuleRequireCallExpressionVisitor', () => {
    const require = identifier("require");
    beforeEach(() => {
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: '',
            warnings: []
        })).mockClear();
        jest.spyOn(addDependency, 'default').mockImplementation().mockClear();
        jest.spyOn(addWarning, 'default').mockImplementation().mockClear();
    })
    
    describe("for require() CallExpressions", () => {
        it('calls getStringPattern', () => {
            const importCall = callExpression(require, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(getStringPattern.default).toBeCalledTimes(1);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(require, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: []
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a dependency when getStringPattern returns a warning', () => {
            const importCall = callExpression(require, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a warning when getStringPattern that returns a warning', () => {
            const importCall = callExpression(require, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addWarning.default).toBeCalledTimes(1);
            expect(addWarning.default).toBeCalledWith("warning", null);
        })
    })
 
    describe("for require.resolve() CallExpressions", () => {
        const requireResolve = memberExpression(require, identifier('resolve'));
        it('calls getStringPattern', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(getStringPattern.default).toBeCalledTimes(1);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: []
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a dependency when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a warning when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addWarning.default).toBeCalledTimes(1);
            expect(addWarning.default).toBeCalledWith("warning", null);
        })
    })
 
    describe("for require.resolveWeak() CallExpressions", () => {
        const requireResolve = memberExpression(require, identifier('resolveWeak'));
        it('calls getStringPattern', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(getStringPattern.default).toBeCalledTimes(1);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: []
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a dependency when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a warning when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireResolve, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addWarning.default).toBeCalledTimes(1);
            expect(addWarning.default).toBeCalledWith("warning", null);
        })
    })
 
    describe("for require.include() CallExpressions", () => {
        const requireInclude = memberExpression(require, identifier('include'));
        it('calls getStringPattern', () => {
            const importCall = callExpression(requireInclude, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(getStringPattern.default).toBeCalledTimes(1);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(requireInclude, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: []
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a dependency when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireInclude, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("test", null);
        })

        it('adds a warning when getStringPattern returns a warning', () => {
            const importCall = callExpression(requireInclude, [stringLiteral("foo")]);
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: ['warning']
            }));

            visit(importCall, null);

            expect(addWarning.default).toBeCalledTimes(1);
            expect(addWarning.default).toBeCalledWith("warning", null);
        })
    })

    it('ignores any other call expression', () => {
        const nonImportCall = callExpression(identifier("fah"), [stringLiteral("foo")]);

        visit(nonImportCall, null);

        expect(addDependency.default).toBeCalledTimes(0);
    })
})