import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { TrelloIFrame } from "../../types/trello"
import { Config } from "../../res/Config"
import { Storage } from "../../data/Storage"

const { localization } = Strings

const boardButtonCapability = async (trello: TrelloIFrame) => [
    {
        ...Config.images.sums,
        text: await Strings.localise("sum", trello),
        callback: async (callbackTrello: TrelloIFrame) =>
            callbackTrello.popup({
                title: await Strings.localise("sum", trello),
                url: "/sums/board-button"
            })
    }
]

const removeDataCapability = (trello: TrelloIFrame) => Promise.all([Storage(trello).remove(Config.keys.sumListId)])

export const Sums = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "board-buttons": boardButtonCapability,
                "remove-data": removeDataCapability
            },
            { localization }
        )
    })

    //todo, add landing page here
    return <p>Sums Plugin</p>
}
