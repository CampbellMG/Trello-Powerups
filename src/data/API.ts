import { Trello } from "../types/trello"
import { Config } from "../res/Config"

type Identifiable = { id: string }
type Card = Identifiable & { idChecklists?: string[]; idList: string }
type Checklist = Identifiable & { checkItems: { name: string }[] }
type SortPreference = "asc" | "desc" | "original"

const mergeChecklists =
    (token: string, trello: Trello.Client) =>
    async (boardId: string, listId: string, sortPreference: SortPreference, cardName?: string) => {
        const appendToken = (extra: object = {}) => ({ token, ...extra })
        const allLists = listId === Config.ids.allLists

        const getCards = async () =>
            new Promise<Card[]>((resolve, reject) =>
                trello.get(`lists/${listId}/cards`, appendToken({ fields: "idChecklists" }), resolve, reject)
            )

        const getAllCards = async () =>
            new Promise<Card[]>((resolve, reject) =>
                trello.get(`boards/${boardId}/cards`, appendToken(), resolve, reject)
            )

        const getChecklist = (checklistId: string) =>
            new Promise<Checklist>((resolve, reject) =>
                trello.get(`checklists/${checklistId}`, appendToken(), resolve, reject)
            )

        const createCard = (containingListId: string) =>
            new Promise<Card>((resolve, reject) =>
                trello.post(`cards/`, appendToken({ name: cardName, idList: containingListId }), resolve, reject)
            )

        const createChecklist = (cardId: string) =>
            new Promise<Checklist>((resolve, reject) =>
                trello.post(`checklists/`, appendToken({ idCard: cardId }), resolve, reject)
            )

        const addChecklistItem = (checklistId: string, name: string) =>
            new Promise((resolve, reject) =>
                trello.post(`checklists/${checklistId}/checkItems`, appendToken({ name }), resolve, reject)
            )

        const cards = allLists ? await getAllCards() : await getCards()
        const cardRequests = cards
            .filter(card => card.idChecklists?.length)
            .reduce((prev, { idChecklists }) => [...prev, ...(idChecklists ?? [])], [] as string[])
            .map(it => getChecklist(it))

        const checkLists = await Promise.all(cardRequests)
        let items = checkLists.reduce(
            (prev, { checkItems }) => [...prev, ...checkItems.map(it => it.name)],
            [] as string[]
        )

        const newCard = await createCard(allLists ? cards[0]?.idList : listId)
        const checkList = await createChecklist(newCard.id)

        if (sortPreference === "asc") {
            items = items.sort()
        }

        if (sortPreference === "desc") {
            items = items.sort().reverse()
        }

        for (const item of items) {
            await addChecklistItem(checkList.id, item)
        }
    }

export const API = (token: string, trello: Trello.Client) => ({
    mergeChecklists: mergeChecklists(token, trello)
})
