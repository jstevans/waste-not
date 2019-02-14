import { memberExpression, numericLiteral } from '@babel/types';
import visit from 'visitors/RequireContextCallExpressionVisitor';
import { stringLiteral, identifier, callExpression } from '@babel/types';
import * as addDependency from 'visitors/utils/addDependency';
import * as addWarning from 'visitors/utils/addWarning';
import * as getStringPattern from 'visitors/utils/getStringPattern';

describe('RequireContextCallExpressionVisitor', () => {
    const requireContext = memberExpression(identifier("require"), identifier('context'));

    beforeEach(() => {

        jest.spyOn(addDependency, 'default').mockImplementation().mockClear();
        jest.spyOn(addWarning, 'default').mockImplementation().mockClear();
    })

    describe("for require.ensure() CallExpressions", () => {
        it('does not call getStringPattern', () => {
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: '',
                warnings: []
            }));

            const importCall = callExpression(requireContext, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(getStringPattern.default).toBeCalledTimes(0);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(requireContext, [stringLiteral("foo")]);

            visit(importCall, null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("foo", null);
        })

        it('adds a warning for each non-string member of the dependencies array', () => {
            const importCall = callExpression(requireContext, [identifier('foo'), numericLiteral(3)]);

            visit(importCall, null);

            expect(addWarning.default).toBeCalledTimes(2);
        })
    })

    it('ignores any other call expression', () => {
        const nonImportCall = callExpression(identifier("fah"), [stringLiteral("foo")]);

        visit(nonImportCall, null);

        expect(addDependency.default).toBeCalledTimes(0);
    })
})