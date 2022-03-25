import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Sums } from "./plugins/sums/Sums"
import { BoardButton as SumsBoardButton } from "./plugins/sums/BoardButton"
import { BoardButton as MergeListsBoardButton } from "./plugins/merge-lists/BoardButton"
import { GlobalStyles } from "./util/GlobalStyles"
import { MergeLists } from "./plugins/merge-lists/MergeLists"

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Sums />} />

            {/* Sums power-up entry point */}
            <Route path="/sums" element={<Sums />} />
            <Route path="/sums/board-button" element={<SumsBoardButton />} />

            {/* Merge Lists power-up entry point */}
            <Route path="/merge-lists" element={<MergeLists />} />
            <Route path="/merge-lists/board-button" element={<MergeListsBoardButton />} />
        </Routes>
        <GlobalStyles />
    </BrowserRouter>
)

export default App
