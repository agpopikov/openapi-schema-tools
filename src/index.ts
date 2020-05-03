enum JsonNodeType {
    NULL = 'NULL',
    BOOLEAN = 'BOOLEAN',
    NUMBER = 'NUMBER',
    STRING = 'STRING',
    OBJECT = 'OBJECT',
    ARRAY_OF_BOOLEAN = 'ARRAY_OF_BOOLEAN',
    ARRAY_OF_NUMBER = 'ARRAY_OF_NUMBER',
    ARRAY_OF_STRING = 'ARRAY_OF_STRING',
    ARRAY_OF_OBJECT = 'ARRAY_OF_OBJECT',
    ARRAY_OF_ARRAY = 'ARRAY_OF_ARRAY',
    ARRAY_OF_ANY = 'ARRAY_OF_ANY'

}

class JsonNode {
    name: string;
    type: JsonNodeType = JsonNodeType.NULL;
    children: JsonNode[] = [];

    constructor(name: string, type: JsonNodeType) {
        this.name = name;
        this.type = type;
    }
}

function getCorrespondingArrayType(type: JsonNodeType): JsonNodeType {
    let map: {[key: string]: JsonNodeType} = {
        'NULL': JsonNodeType.ARRAY_OF_ANY,
        'BOOLEAN': JsonNodeType.ARRAY_OF_BOOLEAN,
        'NUMBER': JsonNodeType.ARRAY_OF_NUMBER,
        'STRING': JsonNodeType.ARRAY_OF_STRING,
        'OBJECT': JsonNodeType.ARRAY_OF_OBJECT,
        'ARRAY': JsonNodeType.ARRAY_OF_ARRAY,
    };
    return map[type] ? map[type] : JsonNodeType.ARRAY_OF_ANY;
}

function parseType(value: any): JsonNodeType {
    if (value === null) {
        return JsonNodeType.NULL;
    }
    let type = typeof value;
    if (type === 'boolean') {
        return JsonNodeType.BOOLEAN;
    } else if (type === 'number') {
        return JsonNodeType.NUMBER;
    } else if (type === 'string') {
        return JsonNodeType.STRING;
    } else if (type === 'object') {
        if (Array.isArray(value)) {
            return JsonNodeType.ARRAY_OF_ANY;
        } else {
            return JsonNodeType.OBJECT;
        }
    }
    return JsonNodeType.NULL;
}

function parseNodes(root: [] | object, initialCall: boolean = false): JsonNode[] {
    if (root === null) {
        return [];
    }
    let result: JsonNode[] = [];
    if (Array.isArray(root)) {
        let types = root.map(v => parseType(v));
        let type = types.reduce((acc, v) => acc === v ? v : JsonNodeType.NULL);

        // todo - detect array type here
    } else {
        // it's object, process it's fields
        Object.entries(root).forEach(entry => {
            let [name, value] = entry;
            let node = new JsonNode(name, parseType(value));
            if (node.type === JsonNodeType.ARRAY_OF_ANY && Array.isArray(root)) {
                node.children = parseNodes(value);
                let types = root.map(v => parseType(v));
                let type = types.reduce((acc, v) => acc === v ? v : JsonNodeType.NULL);
                node.type = getCorrespondingArrayType(type);
                // todo - detect array children type to infer array detailed type
            }
            if (node.type === JsonNodeType.OBJECT) {
                node.children = parseNodes(value);
            }
            result.push(node);
        })
    }
    if (initialCall && !Array.isArray(root)) {
        let node = new JsonNode('', JsonNodeType.OBJECT);
        node.children = result;
        return [node];
    }
    return result;
}

export function run(source: string): JsonNode[] {
    return parseNodes(JSON.parse(source), true);
}
