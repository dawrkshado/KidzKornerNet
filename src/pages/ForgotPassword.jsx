import Back from "../components/Back";
import { useEffect,useState } from "react";
import api from "../api";
function ForgotPassword(){

const [email,set_email] = useState("")



const handleSubmit = async (e) =>{
  e.preventDefault();
    try {
      const res = await api.post("/api/forgot_password/",{
        email
      });
      console.log(res.data)
      set_email("")
    } catch (err) {
      console.error("Error fetching email:", err);
    }
  
}
  
  return(<>
<div className="h-[100vh] w-[100vw] place-items-center place-content-center ">
  <Back/>
    <form onSubmit={handleSubmit} className="h-[100vh] w-[100vw] place-items-center place-content-center">
        <div className="rounded-xl h-[50%] w-[50%] bg-amber-300 flex flex-col shadow-2xl justify-center items-center gap-10 2xl:gap-15">
        <h1 className="2xl:text-2xl">Please enter your email to search for your account.</h1>
          <input type="text"  value={email} onChange={(e) => set_email(e.target.value)} placeholder="Email" className="border-2 w-[50%] rounded-md h-10 2xl:h-15 "/>

          <div className="flex gap-5 ">
             <button type="submit" className=" bg-green-500 h-10 w-20 2xl:h-15 2xl:w-25 rounded-sm transform transition hover:scale-110">
             Submit
          </button>
        
          </div>
      </div>     
    </form>
</div>
  </>)
}

export default ForgotPassword;