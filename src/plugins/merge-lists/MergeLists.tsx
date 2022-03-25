import { BoardButtonCapability } from "./BoardButtonCapability"
import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { RemoveDataCapability } from "./RemoveDataCapability"
import { Config } from "../../res/Config"

const { localization } = Strings

export const MergeLists = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "board-buttons": BoardButtonCapability,
                "remove-data": RemoveDataCapability
            },
            {
                localization,
                appName: Strings.defaultString("mergeLists"),
                appKey: Config.apiKey
            }
        )
    })

    //todo, add landing page here
    return <p>Sums Plugin</p>
}
