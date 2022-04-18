import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Sums } from "./power-ups/sums/Sums"
import { BoardButton as SumsBoardButton } from "./power-ups/sums/BoardButton"
import { BoardButton as MergeChecklistsBoardButton } from "./power-ups/merge-checklists/BoardButton"
import { GlobalStyles } from "./util/GlobalStyles"
import { MergeChecklists } from "./power-ups/merge-checklists/MergeChecklists"
import { Index } from "./routes"
import { Config } from "./res/Config"
import { Privacy } from "./routes/Privacy"

const { sums, mergeChecklists, privacy, boardButton } = Config.routes
const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />
            <Route path={privacy} element={<Privacy />} />

            {/* Sums power-up entry point */}
            <Route path={sums} element={<Sums />} />
            <Route path={sums + boardButton} element={<SumsBoardButton />} />

            {/* Merge Checklists power-up entry point */}
            <Route path={mergeChecklists} element={<MergeChecklists />} />
            <Route path={mergeChecklists + boardButton} element={<MergeChecklistsBoardButton />} />
        </Routes>
        <GlobalStyles />
    </BrowserRouter>
)

export default App
