

import dashboard from "../assets/TeacherHomePage/una.png";

import UploadContents from "../assets/TeacherHomePage/pangatlo.png";
import { Link } from 'react-router-dom'
import Logout from "../components/Logout";
import { useEffect,useState } from "react";
import api from "../api.js";
import ArchivedChildren from "../assets/TeacherHomePage/ArchivedChildrenClick.webp"; 

import logoutImg from "../assets/logout.webp"

function TeacherHomePage() {
const [name, setName] = useState(null);

const [loading, setLoading] = useState(true);
const [clickedLogout, setClickedLogout] = useState(false);
const [logout,setLogout] = useState() 



 useEffect(() => {
    const fetchTeacherData = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/api/user-profile");
        const data =  res.data;
        setName(data.first_name)
      } catch (err) {
        console.error("Error fetching parent data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacherData();
  }, []);


const handleClick = (click) => {
  setLogout(click)
  setClickedLogout(true)

}

const handleCancel = () =>{
  setLogout(null)
  setClickedLogout(false)
}

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-[#3DA8CC] font-[coiny]">
        Loading...
      </div>
    );
  }


  return (
       
    <div className="hidden md:inline md:absolute h-screen w-screen overflow-x-hidden ">
      <div className="hidden md:inline md:absolute h-screen w-screen overflow-x-hidden ">
        <img src="./Bg/mainteacherbg.webp" alt="background" className="w-full"/>
              <div className="text-white text-4xl w-fit absolute top-18 left-100">Teacher {name}</div>
   
        <Link to="/dashboard">
        <img src={dashboard} 
        alt="blue box Button for dashboard page" 
        className="absolute w-[25%] xl:left-[25%] xl:top-[50%] h-[22%] " /></Link>


        <Link to="/uploadcontents">
        <img src={UploadContents}
        alt="blue box Button for upload"
        className="absolute xl:left-[55%] h-[22%]  w-[25%] xl:top-[50%]"/></Link>


        <Link to={"/teacherarchivedchildren "}>
            <img src={ArchivedChildren} className="absolute xl:left-[40%] h-[22%]  w-[25%] xl:top-[80%]" />
        </Link>
         

            <div className="h-[5%] w-[5%] absolute text-3xl top-0 hover:cursor-pointer hover:opacity-80" onClick={() =>handleClick("logout")}> <img src={logoutImg} alt="logout button" /></div>
        </div>

      


        {clickedLogout && logout === "logout" && <>
        <div className='absolute flex justify-center items-center h-[100vh] w-[100vw] '>

        <div className=' h-[100%] w-[100%] bg-gray-800 opacity-50'>       
        </div>
         <div className='flex justify-center items-center absolute h-[40%] w-[40%] bg-blue-200 rounded-2xl'>
          <div>
             <h1 className='text-2xl'>Are you sure you want to <span className='font-bold'>LOGOUT?</span></h1>
            <div className='flex gap-20 justify-center'><Logout/> <h1 className='text-2xl bg-green-500 rounded-lg hover:cursor-pointer' onClick={handleCancel}>Cancel</h1></div>
         </div> 
               
         </div>
   
        </div>
      
        </>}

   

    </div>
    
    
  );
}

export default TeacherHomePage;
