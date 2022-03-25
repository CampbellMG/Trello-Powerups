import { TrelloIFrame } from "../types/trello"
import { Config } from "./Config"
import { Errors } from "../util/Errors"

export type StringKey = keyof typeof strings

const strings = {
    loading: "Loading",
    sum: "Sum",
    noDataError: "No suitable custom fields found in ",
    allLists: "All Lists",
    selectAList: "Select a List",
    field: "Field"
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
