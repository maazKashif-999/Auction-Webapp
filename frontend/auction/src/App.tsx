import {  Route ,Routes} from 'react-router-dom';
import { useState,createContext } from 'react';
import Browse from './pages/Browse';
import SignUp from './pages/SignUp';
import LogIn from './pages/LogIn';
import Profile from './pages/Profile';
import SpecificAuction from './pages/SpecificAuction';
import Home from './pages/Home';
import CreateAuction from './pages/CreateAuction';
import PrivateRoute from './pages/PrivateRoute';
import UpdatePassword from './pages/UpdatePassword';
export const authContext = createContext({ auth: false, setAuth: (value: boolean) => {} });



const App = () => {
  const [auth,setAuth] = useState(false)
  return (
    <authContext.Provider value={{auth,setAuth}}>
      <Routes>
        <Route path="/" element={<LogIn/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route element={<PrivateRoute/>}>
          <Route path="/home" element={<Home/>} />
          <Route path="browse" element={<Browse/>} />
          <Route path="profile" element={<Profile/>} />
          <Route path="/create-auction" element={<CreateAuction/>} />
          <Route path="/auction/:id" element={<SpecificAuction/>} />
          <Route path="/update-password" element={<UpdatePassword/>} />
        </Route>
        
      </Routes> 
    </authContext.Provider>

  );
};

export default App;
