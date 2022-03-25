import { BoardButtonCapability } from "./BoardButtonCapability"
import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { RemoveDataCapability } from "./RemoveDataCapability"

const { localization } = Strings

export const Sums = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "board-buttons": BoardButtonCapability,
                "remove-data": RemoveDataCapability
            },
            { localization }
        )
    })

    //todo, add landing page here
    return <p>Sums Plugin</p>
}
