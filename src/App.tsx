import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import App2 from './App2';
import Dashboad from './Dashboad';
import SearchForm from './components/SearchForm';
import StoreList from './components/StoreList';
import MapCanvas from './components/MapCanvas';
import { LoginForm } from './components/LoginForm';
import { OAuthCallback } from './components/OAuthCallback';



const App: React.FC = () => {

   return (
    // <ErrorBoundary></ErrorBoundary>
    <div className="App">
        <AuthProvider>
          <BrowserRouter>
            <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/OAuthCallback" element={<OAuthCallback />} />
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