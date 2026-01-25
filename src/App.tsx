import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SignUp } from './components/SignUp';
import { OAuthCallback } from "./components/pages/OAuthCallback";
import App2 from './App2';
import Dashboad from './Dashboad';
import SearchForm from './components/SearchForm';
import StoreList from './components/StoreList';
import MapCanvas from './components/MapCanvas';
import { LoginForm } from './components/LoginForm';


const App: React.FC = () => {

   return (
    // <ErrorBoundary></ErrorBoundary>
    <div className="App">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/SignUp" element={<SignUp />} />
            <Route path="/oauth-callback" element={<OAuthCallback />} />
            <Route path="/App2" element={<App2 />} />
            <Route path="/Dashboad" element={<Dashboad />} />
            <Route path="/SearchForm" element={<SearchForm onSearch={() => {}}/>} />
            <Route path="/StoreList" element={<StoreList />} />
            <Route path="/MapCanvas" element={<MapCanvas />} />
            </Routes>
          </BrowserRouter>
         </AuthProvider>      
    </div>
  );
 
} 
 
 

  export default App;