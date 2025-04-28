import styled from "styled-components"
import { useEffect, useMemo, useRef, useState } from "react"
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

type SortKey = "sum" | "name"

type SortState = {
    key: SortKey
    direction: "asc" | "desc"
}

const { localization } = Strings

export const BoardButton = () => {
    const { current: trello } = useRef(window.TrelloPowerUp?.iframe({ localization }))
    const [listId, setListId] = useState<string | undefined>()
    const [sortConfig, setSortConfig] = useState<SortState>({ key: "name", direction: "asc" })
    const sumState = useSum(trello, listId)
    const sortedData = useMemo(() => {
        if (!sumState.data) {
            return []
        }

        const { key, direction } = sortConfig
        return [...sumState.data].sort((a, b) => {
            if (key === "name") {
                return direction === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
            } else {
                return direction === "asc" ? a.sum - b.sum : b.sum - a.sum
            }
        })
    }, [sumState, sortConfig])

    const resize = (content: HTMLDivElement | null) => content?.scrollHeight && trello?.sizeTo(content.scrollHeight)

    useEffect(() => {
        const cacheSelectedList = async () => {
            if (trello) {
                await Storage(trello).set(Config.keys.sumListId, listId)
            }
        }

        cacheSelectedList().catch(Errors.warn)
    }, [listId, trello])

    useEffect(() => {
        const cacheSortConfig = async () => {
            if (trello) {
                await Storage(trello).set(Config.keys.sumSortPreference, sortConfig)
            }
        }

        cacheSortConfig().catch(Errors.warn)
    }, [sortConfig, trello])

    useMount(() => {
        const initialisePreferences = async () => {
            if (!trello) {
                return
            }

            const cachedListId = await Storage(trello).get<string>(Config.keys.sumListId)
            const cachedSortPref = await Storage(trello).get<SortState>(Config.keys.sumSortPreference)

            setListId(cachedListId)

            if (cachedSortPref) {
                setSortConfig(cachedSortPref)
            }
        }

        initialisePreferences().catch(Errors.warn)
    })

    const handleSort = (key: SortKey) => {
        setSortConfig(prev =>
            prev?.key === key
                ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
                : { key, direction: "asc" }
        )
    }

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
                    <SumTableHeader onClick={() => handleSort("name")}>
                        <LocalisedString stringKey={"field"} trello={trello} />
                        {sortConfig?.key === "name" && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                    </SumTableHeader>
                    <SumTableHeader onClick={() => handleSort("sum")}>
                        <LocalisedString stringKey={"sum"} trello={trello} />
                        {sortConfig?.key === "sum" && (sortConfig.direction === "asc" ? " ▲" : " ▼")}
                    </SumTableHeader>
                </tr>
                </thead>
                <tbody>
                {sortedData.map(it => (
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

const SumTableHeader = styled.th`
    cursor: pointer;
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
