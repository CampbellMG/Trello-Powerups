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
import { Sizes } from "../../res/Sizes"

const { localization } = Strings

export const BoardButton = () => {
    const [loading, setLoading] = useState(true)
    const [cardName, setCardName] = useState<string>("")
    const [listId, setListId] = useState<string | undefined>()
    const [token, setToken] = useState<string | undefined>()

    const { current: trello } = useRef(
        window.TrelloPowerUp?.iframe({
            localization,
            appName: Strings.defaultString("mergeLists"),
            appKey: Config.apiKey
        })
    )

    const resize = (content: HTMLDivElement | null) => content?.scrollHeight && trello?.sizeTo(content.scrollHeight)

    const authenticate = async () => {
        setLoading(true)

        try {
            await trello?.getRestApi().authorize(Config.apiScope)
            const newToken = await trello?.getRestApi().getToken()

            if (newToken) {
                setToken(newToken)
            }
        } catch (e) {
            return
        } finally {
            setLoading(false)
        }
    }

    const mergeLists = async () => {
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

            setLoading(false)
        }

        loadCache().catch(Errors.warn)
    }, [trello])

    if (loading) {
        return (
            <LoadingWrapper ref={resize}>
                <Loading />
            </LoadingWrapper>
        )
    }

    if (!token) {
        return (
            <LoadingWrapper ref={resize}>
                <MergeListsIcon src={Config.images.mergeLists.logo} alt={Strings.defaultString("mergeLists")} />
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
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: stretch;
`

const ListSelector = styled(ListSelectorComponent)`
    margin-bottom: ${Sizes.standard}px;
`

const CardNameInput = styled.input`
    margin-bottom: ${Sizes.standard}px;
`

const AuthorisationHint = styled.p`
    text-align: center;
`

const MergeListsIcon = styled.img`
    height: ${Sizes.extraLarge}px;
    width: ${Sizes.extraLarge}px;
    margin-top: ${Sizes.standard}px;
    margin-bottom: ${Sizes.standard}px;
`
