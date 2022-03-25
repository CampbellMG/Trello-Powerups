import { Trello } from "../types/trello"

type Identifiable = { id: string }
type Card = Identifiable & { idChecklists?: string[] }
type Checklist = Identifiable & { checkItems: { name: string }[] }

const mergeChecklists = (token: string, trello: Trello.Client) => async (listId: string, cardName?: string) => {
    const appendToken = (extra: object = {}) => ({ token, ...extra })

    const getCards = async () =>
        new Promise<Card[]>((resolve, reject) =>
            trello.get(`lists/${listId}/cards`, appendToken({ fields: "idChecklists" }), resolve, reject)
        )

    const getChecklist = (checklistId: string) =>
        new Promise<Checklist>((resolve, reject) =>
            trello.get(`checklists/${checklistId}`, appendToken(), resolve, reject)
        )

    const createCard = () =>
        new Promise<Card>((resolve, reject) =>
            trello.post(`cards/`, appendToken({ name: cardName, idList: listId }), resolve, reject)
        )

    const createChecklist = (cardId: string) =>
        new Promise<Checklist>((resolve, reject) =>
            trello.post(`checklists/`, appendToken({ idCard: cardId }), resolve, reject)
        )

    const addChecklistItem = (checklistId: string, name: string) =>
        new Promise((resolve, reject) =>
            trello.post(`checklists/${checklistId}/checkItems`, appendToken({ name }), resolve, reject)
        )

    const cards = await getCards()
    const cardRequests = cards
        .filter(card => card.idChecklists?.length)
        .reduce((prev, { idChecklists }) => [...prev, ...(idChecklists ?? [])], [] as string[])
        .map(it => getChecklist(it))

    const checkLists = await Promise.all(cardRequests)
    const items = checkLists.reduce(
        (prev, { checkItems }) => [...prev, ...checkItems.map(it => it.name)],
        [] as string[]
    )

    const newCard = await createCard()
    const checkList = await createChecklist(newCard.id)

    for (const item of items) {
        await addChecklistItem(checkList.id, item)
    }
}

export const API = (token: string, trello: Trello.Client) => ({
    mergeChecklists: mergeChecklists(token, trello)
})
