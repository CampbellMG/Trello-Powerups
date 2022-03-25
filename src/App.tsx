import React from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Sums } from "./sums/Sums"
import { BoardButton as SumsBoardButton } from "./sums/board-button/BoardButton"
import { GlobalStyles } from "./util/GlobalStyles"

const App = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Sums />} />

            {/* Sums power-up entry point */}
            <Route path="/sums" element={<Sums />} />
            <Route path="/sums/board-button" element={<SumsBoardButton />} />
        </Routes>
        <GlobalStyles />
    </BrowserRouter>
)

export default App
