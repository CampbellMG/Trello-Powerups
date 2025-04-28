import { StorageKey } from "../data/Storage"

const origin = window.location.origin

const sumListId: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "sum-list-id"
}

const checklistMergeListId: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "checklist-merge-list-id"
}

const checklistMergeCardName: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "checklist-merge-card-name"
}

const checklistMergeSortPreference: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "checklist-merge-sort-preference"
}

const sumSortPreference: StorageKey = {
    scope: "board",
    visibility: "private",
    key: "sum-sort-preference"
}

export const Config = {
    email: "campbell@cmgcode.com",
    repo: "https://github.com/CampbellMG/Trello-Powerups",
    stringPath: `${origin}/strings/{locale}.json`,
    apiScope: { scope: "read,write" },
    apiKey: process.env.REACT_APP_TRELLO_KEY,
    trello: "https://trello.com",
    ids: {
        allLists: "all-lists",
        originalOrder: "original-order",
        ascAlphabetical: "ascending-alphabetical",
        descAlphabetical: "descending-alphabetical"
    },
    keys: {
        sumListId,
        checklistMergeListId,
        checklistMergeCardName,
        checklistMergeSortPreference,
        sumSortPreference
    },
    routes: {
        mergeChecklists: "/merge-checklists",
        sums: "/sums",
        boardButton: "/board-button",
        privacy: "/privacy"
    },
    images: {
        logo: `${origin}/img/icon512-logo.png`,
        github: `${origin}/img/icon512-github.png`,
        netlify: `${origin}/img/netlify.svg`,
        sums: {
            logo: `${origin}/img/icon144-sum.png`,
            demo: `${origin}/img/demo-sum.gif`,
            icon: {
                light: `${origin}/img/icon-sum-dark.svg`,
                dark: `${origin}/img/icon-sum-light.svg`
            }
        },
        mergeChecklists: {
            logo: `${origin}/img/icon144-merge-checklists.png`,
            demo: `${origin}/img/demo-merge-checklists.gif`,
            icon: {
                light: `${origin}/img/icon-merge-checklists-dark.svg`,
                dark: `${origin}/img/icon-merge-checklists-light.svg`
            }
        }
    }
}
