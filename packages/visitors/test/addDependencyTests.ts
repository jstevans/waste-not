import addDependency from "../src/utils/addDependency";

describe("addDependency", () => {
    it("adds a 'dependencies' field to state if it doesn't exist", () => {
        const state: any = {};

        addDependency("", state);

        expect(state).toHaveProperty('dependencies');
    })

    it("creates an array in the 'dependencies' field if the field is falsy", () => {
        const state: any = {dependencies: null};

        addDependency("", state);

        expect(Array.isArray(state.dependencies)).toBeTruthy();
    })

    it("appends to the 'dependencies' field if it exists", () => {
        const state: any = {dependencies: []};

        addDependency("foo", state);

        expect(state.dependencies).toEqual(["foo"]);
    })

    it("doesn't overwrite existing elements when appending to the 'dependencies field", () => {
        const state: any = {dependencies: ["test1"]};

        addDependency("foo", state);

        expect(state.dependencies).toEqual(["test1", "foo"]);
    })
})