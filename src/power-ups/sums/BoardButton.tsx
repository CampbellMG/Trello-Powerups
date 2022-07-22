import styled from "styled-components"
import { useEffect, useRef, useState } from "react"
import { Loading } from "../../components/Loading"
import { useSum } from "./UseSum"
import { Strings } from "../../res/Strings"
import { LocalisedString } from "../../components/LocalisedString"
import { ListSelector as ListSelectorComponent } from "../../components/ListSelector"
import { Errors } from "../../util/Errors"
import { useMount } from "../../util/Hooks"
import { Storage } from "../../data/Storage"
import { Config } from "../../res/Config"
import { Sizes } from "../../res/Sizes"

const { localization } = Strings

export const BoardButton = () => {
    const { current: trello } = useRef(window.TrelloPowerUp?.iframe({ localization }))
    const [listId, setListId] = useState<string | undefined>()
    const sumState = useSum(trello, listId)

    const resize = (content: HTMLDivElement | null) => content?.scrollHeight && trello?.sizeTo(content.scrollHeight)

    useEffect(() => {
        const cacheSelectedList = async () => {
            if (trello) {
                await Storage(trello).set(Config.keys.sumListId, listId)
            }
        }

        cacheSelectedList().catch(Errors.warn)
    }, [listId, trello])

    useMount(() => {
        const initialiseSelectedListId = async () => {
            if (!trello) {
                return
            }

            const cachedListId = await Storage(trello).get<string>(Config.keys.sumListId)

            setListId(cachedListId)
        }

        initialiseSelectedListId().catch(Errors.warn)
    })

    if (sumState.loading) {
        return (
            <Wrapper ref={resize}>
                <Loading />
            </Wrapper>
        )
    }

    let Content = () => <div />

    if (sumState.data) {
        Content = () => (
            <SumTable>
                <thead>
                    <tr>
                        <th>
                            <LocalisedString stringKey={"field"} trello={trello} />
                        </th>
                        <th>
                            <LocalisedString stringKey={"sum"} trello={trello} />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {Object.values(sumState.data ?? []).map(it => (
                        <tr key={it.id}>
                            <td>{it.name}</td>
                            <td>{it.sum.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </SumTable>
        )
    }

    if (sumState.error) {
        Content = () => (
            <ErrorTextWrapper>
                <ErrorText>{sumState.error}</ErrorText>
            </ErrorTextWrapper>
        )
    }

    return (
        <Wrapper ref={resize}>
            <ListSelector trello={trello} selectedId={listId} onSelected={setListId} />
            <Content />
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ListSelector = styled(ListSelectorComponent)`
    margin-bottom: ${Sizes.standard}px;
    align-self: stretch;
`

const SumTable = styled.table`
    flex: 1;
`

const ErrorTextWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 ${Sizes.standard}px;
`

const ErrorText = styled.p`
    text-align: center;
`
