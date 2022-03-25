import { StorageKey } from "../storage/Storage"

const origin = window.location.origin
const sumListId: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "sum-list-id"
}

export const Config = {
    stringPath: `${origin}/strings/{locale}.json`,
    ids: {
        allLists: "all-lists"
    },
    keys: {
        sumListId
    },
    images: {
        sums: {
            icon: {
                light: `${origin}/img/icon-sum-dark.svg`,
                dark: `${origin}/img/icon-sum-light.svg`
            }
        }
    }
}
