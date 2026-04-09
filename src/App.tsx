// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/Chat";
import LoginPage from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import './App.css'

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <BrowserRouter>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat/:chatId" element={<ChatPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
