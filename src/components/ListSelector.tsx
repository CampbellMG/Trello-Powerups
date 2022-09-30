import { FunctionComponent, useState } from "react"
import { TrelloIFrame } from "../types/trello"
import { Strings } from "../res/Strings"
import { Config } from "../res/Config"
import { Errors } from "../util/Errors"
import { useMount, useMounted } from "../util/Hooks"
import { Selector } from "./Selector"

type List = { id: string; name: string }

type ListSelectorProps = {
    trello?: TrelloIFrame
    selectedId?: string
    onSelected: (id: string) => void
    className?: string
}

export const ListSelector: FunctionComponent<ListSelectorProps> = props => {
    const { trello } = props
    const [lists, setLists] = useState<List[]>([])
    const mounted = useMounted()

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

    return <Selector items={lists} descriptionKey={"selectAList"} {...props} />
}
