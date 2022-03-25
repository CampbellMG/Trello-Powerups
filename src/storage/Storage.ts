import { Trello, TrelloIFrame } from "../types/trello"

type Visibility = Trello.PowerUp.Visibility
type Scope = Trello.PowerUp.Scope

export type StorageKey = {
    scope: Scope
    visibility: Visibility
    key: string
}

const set =
    (trello: TrelloIFrame) =>
    <T>(key: StorageKey, value: T) =>
        trello.set(key.scope, key.visibility, key.key, value)

const get =
    (trello: TrelloIFrame) =>
    <T>(key: StorageKey): PromiseLike<T | undefined> =>
        trello.get(key.scope, key.visibility, key.key, undefined)

export const Storage = (trello: TrelloIFrame) => ({
    get: get(trello),
    set: set(trello)
})
