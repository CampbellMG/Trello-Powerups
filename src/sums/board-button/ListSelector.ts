import { TrelloIFrame } from "../../types/trello"
import { Storage, StorageKey } from "../../storage/Storage"
import { Strings } from "../../res/Strings"
import { Config } from "../../res/Config"

export const ListSelector = (key: StorageKey) => async (trello: TrelloIFrame) => {
    const lists = await trello.lists("id", "name")
    const allListName = await Strings.localise("allLists", trello)
    const allLists = [{ id: Config.ids.allLists, name: allListName }, ...lists]

    return trello.popup({
        title: await Strings.localise("selectAList", trello),
        items: allLists.map(list => ({
            text: list.name,
            callback: async callbackTrello => {
                await Storage(callbackTrello).set(key, list.id)
                await openSum(callbackTrello)
            }
        }))
    })
}

export const openSum = async (trello: TrelloIFrame) =>
    trello.popup({
        title: await Strings.localise("sum", trello),
        url: "/sums/board-button"
    })
