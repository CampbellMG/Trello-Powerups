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
    email: "campbell@cmgcode.com",
    repo: "https://github.com/CampbellMG/Trello-Powerups",
    stringPath: `${origin}/strings/{locale}.json`,
    apiScope: { scope: "read,write" },
    apiKey: process.env.REACT_APP_TRELLO_KEY,
    trello: "https://trello.com",
    ids: {
        allLists: "all-lists"
    },
    keys: {
        sumListId,
        listMergeListId,
        listMergeCardName
    },
    routes: {
        mergeLists: "/merge-lists",
        sums: "/sums",
        boardButton: "/board-button"
    },
    images: {
        logo: `${origin}/img/icon512-logo.png`,
        github: `${origin}/img/icon512-github.png`,
        sums: {
            logo: `${origin}/img/icon144-sum.png`,
            demo: `${origin}/img/demo-sum.png`,
            icon: {
                light: `${origin}/img/icon-sum-dark.svg`,
                dark: `${origin}/img/icon-sum-light.svg`
            }
        },
        mergeLists: {
            logo: `${origin}/img/icon144-merge-lists.png`,
            demo: `${origin}/img/demo-merge-lists.gif`,
            icon: {
                light: `${origin}/img/icon-merge-lists-dark.svg`,
                dark: `${origin}/img/icon-merge-lists-light.svg`
            }
        }
    }
}
