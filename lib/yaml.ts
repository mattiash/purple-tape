import { stringify } from 'yaml'

export function inlineYamlBlock(obj: any): string {
    if (obj === undefined || obj === '') {
        return ''
    }

    // Handle Error objects by extracting their properties
    let objToSerialize = obj
    if (obj instanceof Error) {
        objToSerialize = {
            name: obj.name,
            message: obj.message,
            stack: obj.stack,
        }
    }

    const yamlStr = stringify(objToSerialize, {
        indent: 2,
    })

    // Add indentation and wrap with --- and ...
    const indented = yamlStr
        .split('\n')
        .filter((line) => line.length > 0)
        .map((line) => '  ' + line)
        .join('\n')

    return `  ---\n${indented}\n  ...\n`
}
