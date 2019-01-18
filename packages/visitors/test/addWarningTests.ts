import addWarning from "../src/utils/addWarning";

describe("addWarning", () => {
    it("adds a 'warnings' field to state if it doesn't exist", () => {
        const state: any = {};

        addWarning("", state);

        expect(state).toHaveProperty('warnings');
    })

    it("creates an array in the 'warnings' field if the field is falsy", () => {
        const state: any = {warnings: null};

        addWarning("", state);

        expect(Array.isArray(state.warnings)).toBeTruthy();
    })

    it("appends to the 'warnings' field if it exists", () => {
        const state: any = {warnings: []};

        addWarning("foo", state);

        expect(state.warnings).toEqual(["foo"]);
    })

    it("doesn't overwrite existing elements when appending to the 'warnings field", () => {
        const state: any = {warnings: ["test1"]};

        addWarning("foo", state);

        expect(state.warnings).toEqual(["test1", "foo"]);
    })
})