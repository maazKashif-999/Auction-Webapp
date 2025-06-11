import React from 'react';
import { useNavigate,Link} from 'react-router-dom';
interface NavBarProps {
  setAuth: (auth: boolean) => void;
}

const NavBar: React.FC<NavBarProps> = ({ setAuth }) => {
  const navigate = useNavigate()
  const handleLogout = ()=>{
    console.log("logout")
    setAuth(false)
    localStorage.removeItem('token')
    navigate("../")
  }
  return (
  <nav className="flex items-center justify-between flex-wrap bg-teal-500 p-4">
    <div className="flex items-center flex-shrink-0 text-white mr-6">
      <span className="font-semibold text-xl tracking-tight">BidMe</span>
    </div>
   
    <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
      <div className="text-ml lg:flex-grow">
        <div  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          <Link to="../home"> Home </Link>
        </div>
        <div  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
          <Link to="../browse">Browse </Link> 
        </div>
        <div  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4" >
          <Link to = "../profile">My Profile</Link>
        </div>
        <div  className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
          <Link to = "../create-auction">Create Auction</Link>
        </div>
      </div>
      <div>
         <p onClick={handleLogout} className="inline-block text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-teal-500 hover:bg-white mt-4 lg:mt-0">Log out</p>
      </div>
    </div>
  </nav>
    
  
  );
}

export default NavBar;
