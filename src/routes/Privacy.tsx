import { Config } from "../res/Config"
import styled from "styled-components"
import { Sizes } from "../res/Sizes"

export const Privacy = () => (
    <Wrapper>
        <Title>Privacy Policy 🔒</Title>
        <p>
            All CMGCode power-ups are completely open source and solely rely on the client (your web browser) to process
            your data. No power-up will ever access personally identifiable information or submit data anywhere except
            Trello.
        </p>
        <p>
            Some power-ups (such as the Merge Checklists power-up) may request you to authorise the power-up on your
            behalf. This is necessary for the power-up to access board data such as checklists or add new data such as
            cards. A power-up will never modify a board without your request or access board data without your
            knowledge. If you would like to revoke a your authorisation you can do so by selecting the "Remove personal
            settings" button in the power-up's settings.
        </p>
        <p>
            If you would like to have a look at what's going on behind the scenes you can find the source code for all
            power-ups here: <a href={Config.repo}>{Config.repo}</a>.
        </p>
        <p>
            If you have any questions or concerns, please contact me at <a href={Config.email}>{Config.email}</a>.
        </p>
    </Wrapper>
)

const Wrapper = styled.div`
    max-width: 50%;
    @media (max-width: 768px) {
        max-width: 80%;
    }

    margin-left: auto;
    margin-right: auto;
    display: flex;
    flex-direction: column;
    padding-top: ${Sizes.extraLarge}px;
`

const Title = styled.h1`
    font-size: 350%;
    line-height: 1.2;
    margin-top: ${Sizes.standard}px;
    margin-bottom: ${Sizes.extraLarge}px;
    align-self: center;
`
