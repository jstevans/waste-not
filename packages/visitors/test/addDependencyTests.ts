import addDependency, { getDependencyKind, DependencyKind } from "../lib/utils/addDependency";

describe("addDependency", () => {
    it("adds a 'dependencies' field to state if it doesn't exist", () => {
        const state: any = {};

        addDependency("", state, 'dependencies' as any);

        expect(state).toHaveProperty('dependencies');
    })

    it("creates an array in the 'dependencies' field if the field is falsy", () => {
        const state: any = {dependencies: null};

        addDependency("", state, 'dependencies' as any);

        expect(Array.isArray(state.dependencies)).toBeTruthy();
    })

    it("appends to the 'dependencies' field if it exists", () => {
        const state: any = {dependencies: []};

        addDependency("foo", state, 'dependencies' as any);

        expect(state.dependencies).toEqual(["foo"]);
    })

    it("doesn't overwrite existing elements when appending to the 'dependencies field", () => {
        const state: any = {dependencies: ["test1"]};

        addDependency("foo", state, 'dependencies' as any);

        expect(state.dependencies).toEqual(["test1", "foo"]);
    })
})

describe('getDependencyKind', () => {
    it("returns DependencyKind.Wildcard for strings ending with a wildcard", () => {
        expect(getDependencyKind('./*')).toBe(DependencyKind.Wildcard);
    })
    
    it("returns DependencyKind.Wildcard for strings containing a wildcard", () => {
        expect(getDependencyKind('./*/foo')).toBe(DependencyKind.Wildcard);
    })

    it("returns DependencyKind.Native for modules provided by the node API", () => {
        expect(getDependencyKind("fs")).toBe(DependencyKind.Native);
    })

    it("returns DependencyKind.File for strings not containing a wildcard that aren't provided by the node API", () => {
        expect(getDependencyKind("./foo")).toBe(DependencyKind.File);
    })

    it("returns DependencyKind.File for the empty string", () => {
        expect(getDependencyKind("")).toBe(DependencyKind.File);
    })
})