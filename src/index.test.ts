import {run} from './index';

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
