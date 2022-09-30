import { FunctionComponent, useState } from "react"
import { TrelloIFrame } from "../types/trello"
import { StringKey, Strings } from "../res/Strings"
import { Config } from "../res/Config"
import { Errors } from "../util/Errors"
import { useMount, useMounted } from "../util/Hooks"
import { Selector } from "./Selector"

type SortOption = { id: string; name: string }

type ListSelectorProps = {
    trello?: TrelloIFrame
    selectedId?: string
    onSelected: (id: string) => void
    className?: string
}

const SortOptions: Record<string, StringKey> = {
    [Config.ids.originalOrder]: "originalOrder",
    [Config.ids.ascAlphabetical]: "ascAlphabetical",
    [Config.ids.descAlphabetical]: "descAlphabetical"
}

export const SortSelector: FunctionComponent<ListSelectorProps> = props => {
    const { trello } = props
    const [lists, setLists] = useState<SortOption[]>([])
    const mounted = useMounted()

    useMount(() => {
        const updateLists = async () => {
            const stringPromises = Object.entries(SortOptions).map(async ([id, stringKey]) => ({
                id,
                name: await Strings.localise(stringKey, trello)
            }))

            const sortOptions = await Promise.all(stringPromises)

            if (mounted()) {
                setLists(sortOptions)
            }
        }

        updateLists().catch(Errors.warn)
    })

    return <Selector items={lists} descriptionKey={"sortBy"} {...props} />
}
