export function inlineYamlBlock(obj: any) {
    let result = Object.keys(obj)
        .map((key) => `${key}: ${jsonValue(obj[key].toString())}`)
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
