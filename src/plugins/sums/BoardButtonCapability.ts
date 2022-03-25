import { TrelloIFrame } from "../../types/trello"
import { Config } from "../../res/Config"
import { Strings } from "../../res/Strings"

export const BoardButtonCapability = async (trello: TrelloIFrame) => [
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
