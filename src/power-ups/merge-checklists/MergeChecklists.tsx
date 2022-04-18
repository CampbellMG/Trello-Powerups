import { useMount } from "../../util/Hooks"
import { Strings } from "../../res/Strings"
import { Config } from "../../res/Config"
import { TrelloIFrame } from "../../types/trello"
import { Storage } from "../../data/Storage"
import styled from "styled-components"
import { Sizes } from "../../res/Sizes"
import { GlobalPageStyles } from "../../util/GlobalPageStyles"

const { localization } = Strings
const { mergeChecklists, boardButton } = Config.routes

const showMergeChecklistsComponent = async (callbackTrello: TrelloIFrame) =>
    callbackTrello.popup({
        title: await Strings.localise("mergeChecklists", callbackTrello),
        url: mergeChecklists + boardButton
    })

const boardButtonCapability = async (trello: TrelloIFrame) => [
    {
        ...Config.images.mergeChecklists,
        text: await Strings.localise("mergeChecklists", trello),
        callback: showMergeChecklistsComponent
    }
]

const removeDataCapability = (trello: TrelloIFrame) =>
    Promise.all([Storage(trello).remove(Config.keys.sumListId), trello.getRestApi().clearToken()])

const authorisationStatusCapability = async (trello: TrelloIFrame) => ({
    authorized: await trello.getRestApi().isAuthorized()
})

export const MergeChecklists = () => {
    useMount(() => {
        const trello = window.TrelloPowerUp

        trello?.initialize(
            {
                "authorization-status": authorisationStatusCapability,
                "show-authorization": showMergeChecklistsComponent,
                "board-buttons": boardButtonCapability,
                "remove-data": removeDataCapability
            },
            {
                localization,
                appName: Strings.defaultString("mergeChecklists"),
                appKey: Config.apiKey
            }
        )
    })

    if (window.origin === Config.trello) {
        return <div />
    }

    return (
        <>
            <GlobalPageStyles />
            <Wrapper>
                <img src={Config.images.mergeChecklists.logo} alt={"Merge checklists power-up icon"} />
                <Title>Merge Checklists</Title>
                <p>
                    This power-up combines checklists from cards in a specific list (or your entire board) into a single
                    checklist. For example, in the demo below we have three cards each with a checklist. With this
                    power-up we can select this list containing all three cards and it will create a fourth with a
                    single checklist including all the items from each card's checklists. I initially created this
                    power-up to assist with creating grocery lists but it could be useful for a number of other
                    scenarios such as a daily to-do list or other shopping lists for something like a construction
                    project.
                </p>
                <p>
                    The page you are currently on will load the power-up when called from a Trello origin so you
                    wouldn't normally see this page. If you'd like to take a look at what's going on under the hood,
                    take a look at the repo here: <RepoLink href={Config.repo}>{Config.repo}</RepoLink>
                </p>
                <DemoImage src={Config.images.mergeChecklists.demo} alt={"Merge checklists power-up demo video"} />
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
    max-width: 50%;
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
