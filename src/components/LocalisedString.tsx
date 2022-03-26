import { FunctionComponent, useState } from "react"
import { StringKey, Strings } from "../res/Strings"
import { useMount, useMounted } from "../util/Hooks"
import { Errors } from "../util/Errors"
import { TrelloIFrame } from "../types/trello"

type LocalisedStringProps = {
    stringKey: StringKey
    trello?: TrelloIFrame
}

export const LocalisedString: FunctionComponent<LocalisedStringProps> = ({ stringKey, trello }) => {
    const [value, setValue] = useState(Strings.defaultString(stringKey))
    const mounted = useMounted()

    useMount(() => {
        const localise = async () => {
            const localised = await Strings.localise(stringKey, trello)

            if (mounted()) {
                setValue(localised)
            }
        }

        localise().catch(Errors.error)
    })

    return <>{value}</>
}
