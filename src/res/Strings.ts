import { TrelloIFrame } from "../types/trello"
import { Config } from "./Config"
import { Errors } from "../util/Errors"

export type StringKey = keyof typeof strings

const strings = {
    loading: "Loading",
    sum: "Sum",
    noDataError: "No suitable custom fields found in selected list",
    allLists: "All Lists",
    selectAList: "Select a List",
    field: "Field",
    mergeChecklists: "Merge Checklists",
    merge: "Merge",
    addACardName: "Add a card name...",
    authorise: "Authorise",
    authorisationHint:
        "To read checklists and create cards on your board we need to connect your account. This power-up will never send your data outside of Trello.",
    doNotCloseWarning: "Closing or clicking outside this pop-up will cancel this merge",
    sortBy: "Sort by",
    originalOrder: "Original order (default)",
    ascAlphabetical: "Alphabetical",
    descAlphabetical: "Reverse alphabetical"
}

const defaultString = (key: StringKey) => strings[key]

const localization = {
    defaultLocale: "en",
    supportedLocales: [
        "cs",
        "de",
        "en",
        "es",
        "fi",
        "fr",
        "hu",
        "it",
        "ja",
        "nb",
        "nl",
        "pl",
        "pt-BR",
        "ru",
        "sv",
        "th",
        "tr",
        "uk",
        "vi",
        "zh-Hans",
        "zh-Hant"
    ],
    resourceUrl: Config.stringPath
}

const localise = async (key: StringKey, trello?: TrelloIFrame) => {
    if (!trello) {
        return defaultString(key)
    }

    try {
        return trello?.localizeKey(key)
    } catch (e) {
        // In the docs this says to use location.search, however, it's never present
        const locale = navigator.language

        Errors.warn(`Failed to localise key: ${key}, attempting to initialise with locale: ${locale}`, e)

        await window.TrelloPowerUp?.util.initLocalizer(locale, { localization })

        try {
            return trello?.localizeKey(key)
        } catch (e) {
            Errors.warn(`Failed again to localise key: ${key}, using default string`, e)

            return defaultString(key)
        }
    }
}

export const Strings = {
    defaultString,
    localise,
    localization
}
