export function inlineYamlBlock(obj: any) {
    let result = Object.keys(obj)
        .map((key) => `${key}: ${jsonValue(stringify(obj[key]))}`)
        .join('\n')
    result = indent(result)
    result = `---\n${result}\n...`
    result = indent(result)
    return result + '\n'
}

function jsonValue(str: string) {
    if (/\:|\-|\?/.test(str)) {
        return `|-\n${indent(str)}`
    } else {
        return str
    }
}

function indent(lines: string) {
    return lines
        .split('\n')
        .map((s) => '  ' + s)
        .join('\n')
}

function stringify(value: any) {
    try {
        const str = value.toString()
        return str
    } catch {
        // In javascript 1.8.5, null and undefined will have a toString()
        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/toString
        return value === undefined
            ? '[Object Undefined]'
            : value === null
              ? '[Object null]'
              : '[Unknown value]'
    }
}
