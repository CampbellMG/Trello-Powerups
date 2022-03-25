import { BoardButtonCapability } from "./board-button/BoardButton.capability"
import { useMount } from "../util/Hooks"
import { Strings } from "../res/Strings"

const { localization } = Strings

export const Sums = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "board-buttons": BoardButtonCapability
            },
            { localization }
        )
    })

    //todo, add landing page here
    return <p>Sums Plugin</p>
}
