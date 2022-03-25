import { TrelloIFrame } from "../../types/trello"
import { Storage } from "../../storage/Storage"
import { Config } from "../../res/Config"
import { ListSelector, openSum } from "./ListSelector"
import { Strings } from "../../res/Strings"

export const BoardButtonCapability = async (trello: TrelloIFrame) => {
    const storage = Storage(trello)

    const sumListKey = Config.keys.sumListId
    const sumListId = storage.get(sumListKey)

    const listSelector = ListSelector(sumListKey)

    return [
        {
            ...Config.images.sums,
            text: await Strings.localise("sum", trello),
            callback: !sumListId ? listSelector : openSum
        }
    ]
}
