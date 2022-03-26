import { FunctionComponent, useState } from "react"
import { TrelloIFrame } from "../types/trello"
import { Strings } from "../res/Strings"
import { Config } from "../res/Config"
import { Errors } from "../util/Errors"
import { LocalisedString } from "./LocalisedString"
import { useMount, useMounted } from "../util/Hooks"

type List = { id: string; name: string }

type ListSelectorProps = {
    trello?: TrelloIFrame
    selectedId?: string
    onSelected: (id: string) => void
    className?: string
}

export const ListSelector: FunctionComponent<ListSelectorProps> = props => {
    const { trello, onSelected, selectedId } = props
    const [lists, setLists] = useState<List[]>([])
    const selectedList = lists.find(it => it.id === selectedId)
    const mounted = useMounted()

    const changeList = async () => {
        if (!lists.length) {
            return
        }

        return trello?.popup({
            title: await Strings.localise("selectAList", trello),
            items: lists.map(list => ({
                text: list.name,
                callback: async callbackTrello => {
                    onSelected(list.id)
                    await callbackTrello.back()
                }
            }))
        })
    }

    useMount(() => {
        const updateLists = async () => {
            const lists = (await trello?.lists("id", "name")) ?? []
            const allListName = await Strings.localise("allLists", trello)
            const allLists = [{ id: Config.ids.allLists, name: allListName }, ...lists]

            if (mounted()) {
                setLists(allLists)
            }
        }

        updateLists().catch(Errors.warn)
    })

    return (
        <button className={props.className} onClick={changeList}>
            {selectedList?.name ?? <LocalisedString stringKey={"selectAList"} />}
        </button>
    )
}
