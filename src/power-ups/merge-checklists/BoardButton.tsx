import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { Config } from "../../res/Config"
import { StringKey, Strings } from "../../res/Strings"
import { Errors } from "../../util/Errors"
import { ListSelector as ListSelectorComponent } from "../../components/ListSelector"
import { Loading } from "../../components/Loading"
import { API } from "../../data/API"
import { LocalisedString } from "../../components/LocalisedString"
import { Storage } from "../../data/Storage"
import { Sizes } from "../../res/Sizes"
import { SortSelector as SortSelectorComponent } from "../../components/SortSelector"

const { localization } = Strings

type LoadingState = {
    loading: boolean
    message?: StringKey
}

export const BoardButton = () => {
    const [loadingState, setLoading] = useState<LoadingState>({ loading: false })
    const [cardName, setCardName] = useState<string>("")
    const [listId, setListId] = useState<string | undefined>()
    const [sortId, setSortId] = useState<string | undefined>()
    const [token, setToken] = useState<string | undefined>()

    const { current: trello } = useRef(
        window.TrelloPowerUp?.iframe({
            localization,
            appName: Strings.defaultString("mergeChecklists"),
            appKey: Config.apiKey
        })
    )

    const resize = (content: HTMLDivElement | null) => content?.scrollHeight && trello?.sizeTo(content.scrollHeight)

    const authenticate = async () => {
        setLoading({ loading: true })

        try {
            await trello?.getRestApi().authorize(Config.apiScope)
            const newToken = await trello?.getRestApi().getToken()

            if (newToken) {
                setToken(newToken)
            }
        } catch (e) {
            return
        } finally {
            setLoading({ loading: false })
        }
    }

    function getSortPreference() {
        if (sortId === Config.ids.ascAlphabetical) {
            return "asc"
        }

        if (sortId === Config.ids.descAlphabetical) {
            return "desc"
        }

        return "original"
    }

    const mergeChecklists = async () => {
        const client = window.Trello

        if (!trello || !token || !cardName || !listId || !client) {
            return
        }

        const storage = Storage(trello)
        const board = await trello.board("id")

        try {
            setLoading({ loading: true, message: "doNotCloseWarning" })

            await storage.set(Config.keys.checklistMergeListId, listId)
            await storage.set(Config.keys.checklistMergeCardName, cardName)
            await storage.set(Config.keys.checklistMergeSortPreference, sortId)

            await API(token, client).mergeChecklists(board.id, listId, getSortPreference(), cardName)
        } catch (e) {
            Errors.error(e as Error)
        } finally {
            await trello.closePopup()
        }
    }

    useEffect(() => {
        const loadCache = async () => {
            if (!trello) {
                return
            }

            const cachedListId = await Storage(trello).get<string>(Config.keys.checklistMergeListId)
            const cachedCardName = await Storage(trello).get<string>(Config.keys.checklistMergeCardName)
            const cachedSortOrder = await Storage(trello).get<string>(Config.keys.checklistMergeSortPreference)
            const cachedToken = await trello?.getRestApi().getToken()

            if (cachedListId) {
                setListId(cachedListId)
            }

            if (cachedCardName) {
                setCardName(cachedCardName)
            }

            if (cachedToken) {
                setToken(cachedToken)
            }

            if (cachedSortOrder) {
                setSortId(cachedSortOrder)
            }

            setLoading({ loading: false })
        }

        loadCache().catch(Errors.warn)
    }, [trello])

    if (loadingState.loading) {
        const loadingMessage = !loadingState.message ? undefined : (
            <LoadingMessage>
                <LocalisedString stringKey={loadingState.message} />
            </LoadingMessage>
        )

        return (
            <LoadingWrapper ref={resize}>
                <Loading />
                {loadingMessage}
            </LoadingWrapper>
        )
    }

    if (!token) {
        return (
            <LoadingWrapper ref={resize}>
                <MergeChecklistsIcon
                    src={Config.images.mergeChecklists.logo}
                    alt={Strings.defaultString("mergeChecklists")}
                />
                <AuthorisationHint>
                    <LocalisedString stringKey={"authorisationHint"} />
                </AuthorisationHint>
                <button className={"mod-primary"} onClick={authenticate}>
                    <LocalisedString stringKey={"authorise"} />
                </button>
            </LoadingWrapper>
        )
    }

    return (
        <Wrapper ref={resize}>
            <ListSelector trello={trello} selectedId={listId} onSelected={setListId} />
            <SortSelector trello={trello} selectedId={sortId} onSelected={setSortId} />
            <CardNameInput
                value={cardName}
                onChange={event => setCardName(event.target.value)}
                placeholder={Strings.defaultString("addACardName")}
            />
            <button className={"mod-primary"} onClick={mergeChecklists} disabled={!listId || !cardName}>
                <LocalisedString stringKey={"mergeChecklists"} />
            </button>
        </Wrapper>
    )
}

const LoadingWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const LoadingMessage = styled.p`
    text-align: center;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

const ListSelector = styled(ListSelectorComponent)`
    margin-bottom: ${Sizes.small}px;
`

const SortSelector = styled(SortSelectorComponent)`
    margin-bottom: ${Sizes.standard}px;
`

const CardNameInput = styled.input`
    margin-bottom: ${Sizes.standard}px;
`

const AuthorisationHint = styled.p`
    text-align: center;
`

const MergeChecklistsIcon = styled.img`
    height: ${Sizes.extraLarge}px;
    width: ${Sizes.extraLarge}px;
    margin-top: ${Sizes.standard}px;
    margin-bottom: ${Sizes.standard}px;
`
