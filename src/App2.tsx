import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboad from './Dashboad';
import { LoginForm } from './components/LoginForm';



const App2: React.FC = () => {

     const navigate = useNavigate();
        const { user, token } = useAuth();
    
      useEffect(() => {

          if (!user && !token) {
            navigate('/'); // ログインしていない場合は認証ページにリダイレクト
          } 
    
      }, [navigate, user, token]);
    
    return  user && token ? <Dashboad /> : <LoginForm />    
}

export default App2;