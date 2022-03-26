import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { Config } from "../../res/Config"
import { TrelloIFrame } from "../../types/trello"
import { Storage } from "../../data/Storage"

const { localization } = Strings

const showMergeListsComponent = async (callbackTrello: TrelloIFrame) =>
    callbackTrello.popup({
        title: await Strings.localise("mergeLists", callbackTrello),
        url: "/merge-lists/board-button"
    })

const boardButtonCapability = async (trello: TrelloIFrame) => [
    {
        ...Config.images.mergeLists,
        text: await Strings.localise("mergeLists", trello),
        callback: showMergeListsComponent
    }
]

const removeDataCapability = (trello: TrelloIFrame) =>
    Promise.all([Storage(trello).remove(Config.keys.sumListId), trello.getRestApi().clearToken()])

const authorisationStatusCapability = async (trello: TrelloIFrame) => ({
    authorized: await trello.getRestApi().isAuthorized()
})

export const MergeLists = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "authorization-status": authorisationStatusCapability,
                "show-authorization": showMergeListsComponent,
                "board-buttons": boardButtonCapability,
                "remove-data": removeDataCapability
            },
            {
                localization,
                appName: Strings.defaultString("mergeLists"),
                appKey: Config.apiKey
            }
        )
    })

    //todo, add landing page here
    return <p>Sums Plugin</p>
}
