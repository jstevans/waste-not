import visit from '../lib/ImportExportDeclarationVisitor';
import { importDeclaration, stringLiteral, exportNamedDeclaration, exportSpecifier, identifier, Declaration, exportAllDeclaration } from '@babel/types';
import * as addDependency from '../lib/utils/addDependency';

describe('ImportDeclarationVisitor', () => {
    beforeEach(() => {
        const spy = jest.spyOn(addDependency, 'default').mockImplementation().mockReset();
    })

    const makeExportNamedDeclaration = 
        (innerDeclaration: Declaration | null, source?: string, ...exportNames: string[]) => 
            exportNamedDeclaration(
                innerDeclaration, 
                exportNames.map(e => identifier(e)).map(i => exportSpecifier(i, i)), 
                source ? stringLiteral(source) : undefined);

    it('adds a dependency from an ImportDeclaration', () => {
        visit(importDeclaration([], stringLiteral("foo")), null as any);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("foo", null);
    })

    it('adds a dependency from an ExportNamedDeclaration', () => {
        visit(makeExportNamedDeclaration(null, "test", "foo"), null as any);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("test", null);
    })

    it('adds a dependency from an ExportAllDeclaration', () => {
        visit(exportAllDeclaration(stringLiteral("foo")), null as any);

        expect(addDependency.default).toBeCalledTimes(1);
        expect(addDependency.default).toBeCalledWith("foo", null);
    })

    it("doesn't add a dependency from an ExportNamedDeclaration without a source", () => {
        const mockDeclaration = makeExportNamedDeclaration(null);
        visit(mockDeclaration, null as any);

        expect(addDependency.default).not.toBeCalled();
    })
})