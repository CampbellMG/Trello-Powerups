import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Sums } from "./power-ups/sums/Sums"
import { BoardButton as SumsBoardButton } from "./power-ups/sums/BoardButton"
import { BoardButton as MergeListsBoardButton } from "./power-ups/merge-lists/BoardButton"
import { GlobalStyles } from "./util/GlobalStyles"
import { MergeLists } from "./power-ups/merge-lists/MergeLists"
import { Index } from "./power-ups"
import { Config } from "./res/Config"

const { sums, mergeLists, boardButton } = Config.routes
const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Index />} />

            {/* Sums power-up entry point */}
            <Route path={sums} element={<Sums />} />
            <Route path={sums + boardButton} element={<SumsBoardButton />} />

            {/* Merge Lists power-up entry point */}
            <Route path={mergeLists} element={<MergeLists />} />
            <Route path={mergeLists + boardButton} element={<MergeListsBoardButton />} />
        </Routes>
        <GlobalStyles />
    </BrowserRouter>
)

export default App
