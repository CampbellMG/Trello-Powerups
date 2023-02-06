import { FunctionComponent } from "react"
import { TrelloIFrame } from "../types/trello"
import { StringKey, Strings } from "../res/Strings"
import { LocalisedString } from "./LocalisedString"

type Item = { id: string; name: string }

type SelectorProps = {
    trello?: TrelloIFrame
    items: Item[]
    selectedId?: string
    onSelected: (id: string) => void
    descriptionKey: StringKey
    className?: string
}

export const Selector: FunctionComponent<SelectorProps> = props => {
    const { trello, onSelected, selectedId, items, descriptionKey } = props
    const selectedList = items.find(it => it.id === selectedId)

    const changeList = async () => {
        if (!items.length) {
            return
        }

        return trello?.popup({
            title: await Strings.localise(descriptionKey, trello),
            items: items.map(list => ({
                text: list.name,
                callback: async callbackTrello => {
                    onSelected(list.id)
                    await callbackTrello.back()
                }
            }))
        })
    }

    return (
        <button className={props.className} onClick={changeList}>
            {selectedList?.name ?? <LocalisedString stringKey={descriptionKey} />}
        </button>
    )
}
