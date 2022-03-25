import { TrelloIFrame } from "../../types/trello"
import { Config } from "../../res/Config"
import { Storage } from "../../data/Storage"

export const RemoveDataCapability = (trello: TrelloIFrame) =>
    Promise.all([Storage(trello).remove(Config.keys.sumListId)])
