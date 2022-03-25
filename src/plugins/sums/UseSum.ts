import { useEffect, useState } from "react"
import { Config } from "../../res/Config"
import { Strings } from "../../res/Strings"
import { Errors } from "../../util/Errors"
import { Trello, TrelloIFrame } from "../../types/trello"

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
    data?: Sum[]
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

export const useSum = (trello?: TrelloIFrame, listId?: string) => {
    const [state, setState] = useState<State>({})

    useEffect(() => {
        const updateSums = async () => {
            if (!trello || !listId) {
                return
            }

            setState({ loading: true })

            const cards = await trello.cards("id", "idList", "customFieldItems")
            const fields = await trello.board("customFields")
            const listCards = listId === Config.ids.allLists ? cards : cards.filter(it => it.idList === listId)

            const sum = sumFields(listCards, fields)
            const error = sum.length ? undefined : await Strings.localise("noDataError", trello)

            setState({ error, data: sum })
        }

        updateSums().catch(e => {
            setState({ error: "Failed to load trello data" })
            Errors.error(e)
        })
    }, [trello, listId])

    return state
}
