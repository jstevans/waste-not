import { Visitor } from "walker/types";
import addDependency from "./utils/addDependency";
import { TSImportEqualsDeclaration, isTSImportEqualsDeclaration, isTSExternalModuleReference, isStringLiteral } from "@babel/types";
import addWarning from "./utils/addWarning";

const IMPORT_EQUALS_MUST_BE_STRING_LITERAL = "import-equals syntax only supports string literals.";

const TSImportEqualsDeclarationVisitor: Visitor<TSImportEqualsDeclaration> =
    function visitTSImportEqualsDeclaration(node: TSImportEqualsDeclaration, state: any) {
        if (isTSImportEqualsDeclaration(node) && isTSExternalModuleReference(node.moduleReference)) {
            if (!isStringLiteral(node.moduleReference.expression)) {
                addWarning(IMPORT_EQUALS_MUST_BE_STRING_LITERAL, state);
            } else {
                addDependency(node.moduleReference.expression.value, state);
            }
        }
    }


export default TSImportEqualsDeclarationVisitor;