import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { TrelloIFrame } from "../../types/trello"
import { Config } from "../../res/Config"
import { Storage } from "../../data/Storage"
import { GlobalPageStyles } from "../../util/GlobalPageStyles"
import styled from "styled-components"
import { Sizes } from "../../res/Sizes"

const { localization } = Strings
const { sums, boardButton } = Config.routes

const boardButtonCapability = async (trello: TrelloIFrame) => [
    {
        ...Config.images.sums,
        text: await Strings.localise("sum", trello),
        callback: async (callbackTrello: TrelloIFrame) =>
            callbackTrello.popup({
                title: await Strings.localise("sum", trello),
                url: sums + boardButton
            })
    }
]

const removeDataCapability = (trello: TrelloIFrame) => Promise.all([Storage(trello).remove(Config.keys.sumListId)])

export const Sums = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "board-buttons": boardButtonCapability,
                "remove-data": removeDataCapability
            },
            { localization }
        )
    })

    if (window.origin === Config.trello) {
        return <div />
    }

    return (
        <>
            <GlobalPageStyles />
            <Wrapper>
                <img src={Config.images.sums.logo} alt={"Sums power-up icon"} />
                <Title>Sums</Title>
                <p>
                    This power-up tallies custom fields on your Trello board allowing you to see totals for the entire
                    board or specific lists. In the example below we have four number-type custom fields that
                    demonstrate some of the ways we might be able to use this power-up use. If you are keeping track of
                    things like points, time tracking or costs then this power-up can give you sums that are easy to
                    read and filter. There are a couple of power-ups out there that do something similar already,
                    however, only one of them works with custom fields and it doesn't allow you to filter by lists which
                    is a pretty crucial feature in my opinion. Since Trello have added custom fields to their core app
                    on the base plan I think this is the best approach to keeping track of card values which is a key
                    feature on a lot of boards.
                </p>
                <p>
                    The page you are currently on will load the power-up when called from a Trello origin so you
                    wouldn't normally see this page. If you'd like to take a look at what's going on under the hood,
                    take a look at the repo here: <RepoLink href={Config.repo}>{Config.repo}</RepoLink>
                </p>
                <DemoImage src={Config.images.sums.demo} alt={"Sums power-up screenshot"} />
            </Wrapper>
        </>
    )
}

const Wrapper = styled.div`
    max-width: 50%;
    @media (max-width: 768px) {
        max-width: 80%;
    }

    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: ${Sizes.extraLarge}px;
`

const Title = styled.h1`
    font-size: 450%;
    line-height: 1.2;
    margin-top: ${Sizes.standard}px;
    margin-bottom: ${Sizes.extraLarge}px;
`

const DemoImage = styled.img`
    max-width: 70%;
    border-radius: ${Sizes.standard}px;
    box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
    margin-top: ${Sizes.extraLarge}px;
    margin-bottom: ${Sizes.extraLarge}px;
`

const RepoLink = styled.a`
    position: relative;
    font-weight: bold;
    text-decoration: none;

    &:after {
        content: "";
        position: absolute;
        bottom: -2px;
        left: 0;
        right: 0;
        height: 2px;
        transform: scaleX(0);
        background-color: black;
        transition: transform 0.3s ease 0s;
    }

    &:hover:after {
        transform: scaleX(1);
    }
`
