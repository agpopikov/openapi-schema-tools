import {JsonNodeType, run} from './index';

test('detect array items type (string)', () => {
    let result = run(`
        { "example_0": ["1", "2", "true", "etc"], "example_1": [1, 2, 3], "example_2": [], "example_3": [{"a": 1}] }
    `);
    expect(result[0].type).toBe(JsonNodeType.OBJECT);
    expect(result[0].children.length).toBe(4);
    //
    expect(result[0].children[0].type).toBe(JsonNodeType.ARRAY_OF_STRING);
    expect(result[0].children[0].children).toStrictEqual([]);
    //
    expect(result[0].children[1].type).toBe(JsonNodeType.ARRAY_OF_NUMBER);
    expect(result[0].children[1].children).toStrictEqual([]);
    //
    expect(result[0].children[2].type).toBe(JsonNodeType.ARRAY_OF_ANY);
    expect(result[0].children[2].children).toStrictEqual([]);
    //
    expect(result[0].children[3].type).toBe(JsonNodeType.ARRAY_OF_OBJECT);
    expect(result[0].children[3].children.length).toBe(1);
});

test('run on first example JSON', () => {
    const example = `{
        "checked": false,
        "dimensions": {
            "width": 5,
            "height": 10
        },
        "id": 1,
        "name": "A green door",
        "price": 12.5,
        "tags": [
            "home",
            "green"
        ]
    }`;
    let result = run(example);
    let i = 0;
});
