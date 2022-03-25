import styled from "styled-components"
import { useRef } from "react"
import { Config } from "../../res/Config"
import { Loading } from "../../components/Loading"
import { ListSelector } from "./ListSelector"
import { useSum } from "./UseSum"
import { Strings } from "../../res/Strings"
import { LocalisedString } from "../../components/LocalisedString"

const { localization } = Strings

export const BoardButton = () => {
    const { current: trello } = useRef(window.TrelloPowerUp?.iframe({ localization }))
    const sumState = useSum(trello)

    const resize = (content: HTMLDivElement) => trello?.sizeTo(content)

    const changeList = () => {
        if (!trello) {
            return
        }

        ListSelector(Config.keys.sumListId)(trello)
    }

    if (sumState.loading) {
        return (
            <Wrapper>
                <Loading />
            </Wrapper>
        )
    }

    if (sumState.error) {
        return (
            <Wrapper ref={resize}>
                <ListButton onClick={changeList}>{sumState.data?.listName}</ListButton>
                <ErrorTextWrapper>
                    <ErrorText>{sumState.error}</ErrorText>
                </ErrorTextWrapper>
            </Wrapper>
        )
    }

    return (
        <Wrapper ref={resize}>
            <ListButton onClick={changeList}>{sumState.data?.listName}</ListButton>
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
                    {Object.values(sumState.data?.sum ?? []).map(it => (
                        <tr key={it.id}>
                            <td>{it.name}</td>
                            <td>{it.sum}</td>
                        </tr>
                    ))}
                </tbody>
            </SumTable>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    min-height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const ListButton = styled.button`
    margin-bottom: 16px;
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
    margin: 0 16px;
`

const ErrorText = styled.p`
    text-align: center;
`
