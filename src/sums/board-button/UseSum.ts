import { useCallback, useEffect, useState } from "react"
import { Config } from "../../res/Config"
import { Strings } from "../../res/Strings"
import { Storage } from "../../storage/Storage"
import { Errors } from "../../util/Errors"
import { Trello, TrelloIFrame } from "../../types/trello"
import { isEmpty } from "../../util/Functions"

type Board = Trello.PowerUp.Board
type Card = Trello.PowerUp.Card
type Sum = {
    id: string
    name?: string
    sum: number
}
type State = {
    loading?: boolean
    error?: string
    data?: {
        listName?: string
        sum: Sum[]
    }
}

const sumFields = (cards: Card[], fields: Board) => {
    const fieldNames = fields.customFields.reduce(
        (names, field) => ({
            ...names,
            [field.id]: field.name
        }),
        {} as Record<string, string>
    )

    const sums = cards.reduce((sum, card) => {
        card.customFieldItems.forEach(field => {
            if (field.value?.number === undefined) {
                return
            }

            const id = field.idCustomField
            const current = sum[id]?.sum ?? 0

            sum[id] = {
                id,
                name: fieldNames[id],
                sum: current + +field.value?.number
            }
        })

        return sum
    }, {} as Record<string, Sum>)

    return Object.values(sums)
}

export const useSum = (trello?: TrelloIFrame) => {
    const [state, setState] = useState<State>({ loading: true })

    const getListName = useCallback(
        async (id: string) => {
            if (id === Config.ids.allLists) {
                return await Strings.localise("allLists", trello)
            }

            const allLists = await trello?.lists("id", "name")
            return allLists?.find(it => it.id === id)?.name
        },
        [trello]
    )

    useEffect(() => {
        const updateSums = async () => {
            if (!trello) {
                return
            }

            const storage = Storage(trello)

            const listId = await storage?.get<string>(Config.keys.sumListId)

            if (!listId) {
                Errors.warn("The sum component should not be loaded without a list ID")
                return
            }

            const cards = await trello.cards("id", "idList", "customFieldItems")
            const fields = await trello.board("customFields")
            const listName = await getListName(listId)
            const listCards = listId === Config.ids.allLists ? cards : cards.filter(it => it.idList === listId)

            const sum = sumFields(listCards, fields)
            let error = undefined

            if (isEmpty(sum)) {
                error = (await Strings.localise("noDataError", trello)) + listName
            }

            setState({ error, data: { listName, sum } })
        }

        updateSums().catch(e => {
            setState({ error: "Failed to load trello data" })
            Errors.error(e)
        })
    }, [trello, getListName])

    return state
}
