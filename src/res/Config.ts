import { StorageKey } from "../data/Storage"

const origin = window.location.origin

const sumListId: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "sum-list-id"
}

const listMergeListId: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "list-merge-list-id"
}

const listMergeCardName: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "list-merge-card-name"
}

export const Config = {
    stringPath: `${origin}/strings/{locale}.json`,
    apiScope: { scope: "read,write" },
    apiKey: process.env.REACT_APP_TRELLO_KEY,
    ids: {
        allLists: "all-lists"
    },
    keys: {
        sumListId,
        listMergeListId,
        listMergeCardName
    },
    images: {
        sums: {
            icon: {
                light: `${origin}/img/icon-sum-dark.svg`,
                dark: `${origin}/img/icon-sum-light.svg`
            }
        },
        mergeLists: {
            logo: `${origin}/img/icon144-merge-lists.png`,
            icon: {
                light: `${origin}/img/icon-merge-lists-dark.svg`,
                dark: `${origin}/img/icon-merge-lists-light.svg`
            }
        }
    }
}
