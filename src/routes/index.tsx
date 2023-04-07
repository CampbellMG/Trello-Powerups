import { Config } from "../res/Config"
import styled from "styled-components"
import { Sizes } from "../res/Sizes"
import { GlobalPageStyles } from "../util/GlobalPageStyles"
import { Link } from "react-router-dom"

export const Index = () => (
    <>
        <GlobalPageStyles />
        <Wrapper>
            <Intro>
                <MainIcon src={Config.images.logo} alt={"Power-up icon"} />
                <Heading>Hey there 👋</Heading>
                <IntroContent>
                    It looks like you've come across my Trello Power-ups. This page is usually silently loaded by Trello
                    but why not take a look around while you're here? If you have any questions feel free to contact me
                    through the Github link below or email me at{" "}
                    <Email href={`mailto:${Config.email}`}>{Config.email}</Email>
                </IntroContent>
            </Intro>
            <ul>
                <li>
                    <ExternalLink href={Config.repo}>
                        <PowerUpIcon src={Config.images.github} alt={"Github icon"} />
                        <div>
                            <PowerUpHeading>Repository</PowerUpHeading>
                            <p>
                                This repository contains the single entry point for all the power-ups below (and the
                                page you're on now). The app is written using React (CRA), Styled Components,
                                React-Router-Dom & Typescript. Development is all free and open source under the MIT
                                license, you just need to create your own Trello developer account to start working on
                                your own.
                            </p>
                        </div>
                    </ExternalLink>
                </li>
                <li>
                    <LocalLink to={Config.routes.sums}>
                        <PowerUpIcon src={Config.images.sums.logo} alt={"Sum power-up icon"} />
                        <div>
                            <PowerUpHeading>Sums</PowerUpHeading>
                            <p>
                                This power-up tallies custom fields on your Trello board allowing you to see totals for
                                the entire board or specific lists. This is probably the simplest power-up to get
                                started with as it doesn't require any authentication, all functionality uses the Trello
                                Power-up client's built in functionality. I've found this one useful for keeping track
                                of things like costs, points or time.
                            </p>
                        </div>
                    </LocalLink>
                </li>
                <li>
                    <LocalLink to={Config.routes.mergeChecklists}>
                        <PowerUpIcon src={Config.images.mergeChecklists.logo} alt={"Merge checklists power-up icon"} />
                        <div>
                            <PowerUpHeading>Merge Checklists</PowerUpHeading>
                            <p>
                                This power-up combines checklists from cards in a specific list (or your entire board)
                                into a single checklist. This one is a bit more complicated and requires the user to
                                authorise usage of the API on their behalf. This is necessary as we need to use the
                                Trello REST API to create cards and access some data (like checklists) that isn't Trello
                                available in the Trello Power-up client. I use this one weekly to create my grocery
                                lists.
                            </p>
                        </div>
                    </LocalLink>
                </li>
            </ul>

            <NetlifyLink href="https://www.netlify.com">
                <img src="https://www.netlify.com/v3/img/components/netlify-color-bg.svg" alt="Deploys by Netlify" />
            </NetlifyLink>
        </Wrapper>
    </>
)

const Wrapper = styled.div`
    max-width: 60%;
    @media (max-width: 768px) {
        max-width: 80%;
    }

    display: flex;
    flex-direction: column;
    margin-left: auto;
    margin-right: auto;
`

const Intro = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: ${Sizes.extraLarge}px;
`

const MainIcon = styled.img`
    width: 25%;
    margin: ${Sizes.standard}px 0;
`

const Heading = styled.h1`
    font-size: 450%;
    line-height: 1.5;
`

const IntroContent = styled.p`
    max-width: 80%;
    text-align: center;
    margin-bottom: ${Sizes.extraLarge}px;
`

const Email = styled.a`
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

const ExternalLink = styled.a`
    display: flex;
    padding: ${Sizes.large}px;
    text-decoration: none;
    border-radius: ${Sizes.standard}px;

    &:hover {
        box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
        transition: box-shadow 0.15s ease-in-out;
    }

    &:active {
        box-shadow: none;
    }
`

const LocalLink = styled(Link)`
    display: flex;
    padding: ${Sizes.large}px;
    text-decoration: none;
    border-radius: ${Sizes.standard}px;

    &:hover {
        box-shadow: rgba(100, 100, 111, 0.2) 0 7px 29px 0;
        transition: box-shadow 0.15s ease-in-out;
    }

    &:active {
        box-shadow: none;
    }
`

const PowerUpHeading = styled.h3`
    font-size: 2em;
    margin-bottom: ${Sizes.standard}px;
`

const PowerUpIcon = styled.img`
    height: ${Sizes.extraLarge}px;
    width: ${Sizes.extraLarge}px;
    margin-right: ${Sizes.standard}px;
`

const NetlifyLink = styled.a`
    align-self: center;
    margin-top: ${Sizes.large}px;

    &:hover {
        box-shadow: rgba(100, 100, 111, 0.2) 0 10px 10px 0;
        transition: box-shadow 0.15s ease-in-out;
    }

    &:active {
        box-shadow: none;
    }
`
