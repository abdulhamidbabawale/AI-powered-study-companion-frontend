// import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import ChatPage from "./pages/Chat";
import LoginPage from "./pages/Login";
import AssessmentsPage from "./pages/Assessments";
import ProtectedRoute from "./routes/ProtectedRoute";
import './App.css'
import AppLayout from './components/AppLayout'  

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
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/chat/:chatId" element={<ChatPage key={window.location.pathname} />} />
          <Route path="/assessments" element={<AssessmentsPage />} />
          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
