import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { Config } from "../../res/Config"
import { Strings } from "../../res/Strings"
import { Errors } from "../../util/Errors"
import { ListSelector as ListSelectorComponent } from "../../components/ListSelector"
import { Loading } from "../../components/Loading"
import { API } from "../../data/API"
import { LocalisedString } from "../../components/LocalisedString"
import { Storage } from "../../data/Storage"

const { localization } = Strings

export const BoardButton = () => {
    const [loading, setLoading] = useState(false)
    const [cardName, setCardName] = useState<string>("")
    const [listId, setListId] = useState<string | undefined>()

    const { current: trello } = useRef(
        window.TrelloPowerUp?.iframe({
            localization,
            appName: Strings.defaultString("mergeLists"),
            appKey: Config.apiKey
        })
    )

    const resize = (content: HTMLDivElement | null) => content?.scrollHeight && trello?.sizeTo(content.scrollHeight)

    const mergeLists = async () => {
        const token = await trello?.getRestApi().getToken()
        const client = window.Trello

        if (!trello || !token || !cardName || !listId || !client) {
            return
        }

        const storage = Storage(trello)

        try {
            setLoading(true)

            await storage.set(Config.keys.listMergeListId, listId)
            await storage.set(Config.keys.listMergeCardName, cardName)

            await API(token, client).mergeChecklists(listId, cardName)
        } catch (e) {
            Errors.error(e as Error)
        } finally {
            trello?.closePopup()
        }
    }

    useEffect(() => {
        const loadCache = async () => {
            if (!trello) {
                return
            }

            const cachedListId = await Storage(trello).get<string>(Config.keys.listMergeListId)
            const cachedCardName = await Storage(trello).get<string>(Config.keys.listMergeCardName)

            if (cachedListId) {
                setListId(cachedListId)
            }

            if (cachedCardName) {
                setCardName(cachedCardName)
            }
        }

        const authenticate = async () => {
            setLoading(true)

            let token = await trello?.getRestApi().getToken()

            try {
                if (!token) {
                    await trello?.getRestApi().authorize(Config.apiScope)
                    token = await trello?.getRestApi().getToken()
                }
            } catch (e) {
                Errors.warn("Failed to authorise", e)
                trello?.closePopup()
                return
            }

            if (!token) {
                Errors.warn("Token not available")
                trello?.closePopup()
                return
            }

            setLoading(false)
        }

        loadCache().catch(Errors.warn)
        authenticate().catch(Errors.warn)
    }, [trello])

    if (loading) {
        return (
            <LoadingWrapper ref={resize}>
                <Loading />
            </LoadingWrapper>
        )
    }

    return (
        <Wrapper ref={resize}>
            <ListSelector trello={trello} selectedId={listId} onSelected={setListId} />
            <CardNameInput
                value={cardName}
                onChange={event => setCardName(event.target.value)}
                placeholder={Strings.defaultString("addACardName")}
            />
            <button className={"mod-primary"} onClick={mergeLists} disabled={!listId || !cardName}>
                <LocalisedString stringKey={"mergeLists"} />
            </button>
        </Wrapper>
    )
}

const LoadingWrapper = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Wrapper = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

const ListSelector = styled(ListSelectorComponent)`
    margin-bottom: 16px;
`

const CardNameInput = styled.input`
    margin-bottom: 16px;
`
