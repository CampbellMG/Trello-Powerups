import { TrelloIFrame } from "../../types/trello"
import { Config } from "../../res/Config"
import { Strings } from "../../res/Strings"

export const BoardButtonCapability = async (trello: TrelloIFrame) => [
    {
        ...Config.images.mergeLists,
        text: await Strings.localise("mergeLists", trello),
        callback: async (callbackTrello: TrelloIFrame) =>
            callbackTrello.popup({
                title: await Strings.localise("mergeLists", callbackTrello),
                url: "/merge-lists/board-button"
            })
    }
]
