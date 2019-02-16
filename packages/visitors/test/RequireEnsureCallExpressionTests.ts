import { memberExpression, numericLiteral, arrayExpression } from '@babel/types';
import visit from '../lib/RequireEnsureCallExpressionVisitor';
import { stringLiteral, identifier, callExpression } from '@babel/types';
import * as addDependency from '../lib/utils/addDependency';
import * as addWarning from '../lib/utils/addWarning';
import * as getStringPattern from '../lib/utils/getStringPattern';

describe('RequireEnsureCallExpressionVisitor', () => {
    const requireEnsure = memberExpression(identifier("require"), identifier('ensure'));

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

            const importCall = callExpression(requireEnsure, [arrayExpression([stringLiteral("foo")])]);

            visit(importCall, null as any);

            expect(getStringPattern.default).toBeCalledTimes(0);
        })

        it('adds a dependency', () => {
            const importCall = callExpression(requireEnsure, [arrayExpression([stringLiteral("foo")])]);

            visit(importCall, null as any);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("foo", null);
        })

        it('adds a warning for each non-string member of the dependencies array', () => {
            const importCall = callExpression(requireEnsure, [arrayExpression([identifier('foo'), numericLiteral(3)])]);

            visit(importCall, null as any);

            expect(addWarning.default).toBeCalledTimes(2);
        })
    })

    it('ignores any other call expression', () => {
        const nonImportCall = callExpression(identifier("fah"), [stringLiteral("foo")]);

        visit(nonImportCall, null as any);

        expect(addDependency.default).toBeCalledTimes(0);
    })
})