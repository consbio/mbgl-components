export const arraysAreEqual = (a, b) => {
    if (a === b) {
        return true
    }
    if (a.length !== b.length) {
        return false
    }

    for (let i = 0; i < a.length; ++i) {
        if (typeof a[i] !== typeof b[i]) {
            return false
        }

        if (Array.isArray(a[i]) !== Array.isArray(b[i])) {
            return false
        }

        if (Array.isArray(a[i])) {
            if (!arraysAreEqual(a[i], b[i])) {
                return false
            }
        } else if (typeof a[i] === 'object') {
            if (!objectsAreEqual(a[i], b[i])) {
                return false
            }
        } else if (a[i] !== b[i]) {
            return false
        }
    }

    return true
}

export const objectsAreEqual = (a, b) => {
    if (a === b) {
        return true
    }

    const aEntries = Object.entries(a)
    const bEntries = Object.entries(b)

    if (aEntries.length !== bEntries.length) {
        return false
    }

    for (let i = 0; i < aEntries.length; ++i) {
        const [key, valueA] = aEntries[i]

        if (!(key in b)) {
            return false
        }

        const valueB = b[key]

        if (typeof valueA !== typeof valueB) {
            return false
        }

        if (Array.isArray(valueA)) {
            if (!arraysAreEqual(valueA, valueB)) {
                return false
            }
        } else if (typeof valueA === 'object') {
            if (!objectsAreEqual(valueA, valueB)) {
                return false
            }
        } else if (valueA !== valueB) {
            return false
        }
    }

    return true
}

export const objectFromEntries = iterable => {
    const obj = {}
    iterable.forEach(([key, value]) => {
        obj[key] = value
    })
    return obj
}
