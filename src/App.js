import { BrowserRouter, Route, Routes } from "react-router-dom";
import ListPage from "./pages/ListPage";
import CreatePage from "./pages/CreatePage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route index element={<ListPage/>}/>
                <Route path="/employee/create" element={<CreatePage/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;