import { binaryExpression } from '@babel/types';
import { tsImportEqualsDeclaration, tsExternalModuleReference } from '@babel/types';
import visit from '../src/TSImportEqualsDeclarationVisitor';
import { stringLiteral, identifier, } from '@babel/types';
import * as addDependency from '../src/utils/addDependency';
import * as addWarning from '../src/utils/addWarning';
import * as getStringPattern from '../src/utils/getStringPattern';

describe('TSImportEqualsDeclarationVisitor', () => {
    const makeImportCall = (ref = stringLiteral('./foo')) => tsImportEqualsDeclaration(
        identifier("foo"),
        tsExternalModuleReference(ref));

    beforeEach(() => {
        jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
            depPattern: '',
            warnings: []
        })).mockClear();
        jest.spyOn(addDependency, 'default').mockImplementation().mockClear();
        jest.spyOn(addWarning, 'default').mockImplementation().mockClear();
    })

    describe("for import = require() declarations", () => {
        it('does not call getStringPattern', () => {

            visit(makeImportCall(), null);

            expect(getStringPattern.default).toBeCalledTimes(0);
        })

        it('adds a dependency', () => {
            jest.spyOn(getStringPattern, 'default').mockImplementation(() => ({
                depPattern: "test",
                warnings: []
            }));

            visit(makeImportCall(), null);

            expect(addDependency.default).toBeCalledTimes(1);
            expect(addDependency.default).toBeCalledWith("./foo", null);
        })

        it('adds a warning when the require call contains a non-string-literal', () => {

            visit({
                type: 'TSImportEqualsDeclaration',
                id: identifier('foo'),
                moduleReference: {
                    type: 'TSExternalModuleReference',
                    expression: binaryExpression(
                        "+",
                        stringLiteral("./"),
                        stringLiteral("foo"))
                }
            } as any, null);

            expect(addWarning.default).toBeCalledTimes(1);
        })
    })
})