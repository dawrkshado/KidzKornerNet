
import { useState } from "react"
function ResetPassword(){
  const [password,setPassword] = useState("")
  const [reEnterPass, setReEnterPass] = useState("")

  
  const handleClear = () => {
    setReEnterPass("")
    setPassword("")
  }
  const handleSubmit = (e) => {
     e.preventDefault();
    if (password != reEnterPass){
      return;
    }

    console.log("it works :)")
    handleClear()

  }


  return(<>
    <div className=" h-[100vh] w-[100vw] place-items-center place-content-center">
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 h-[50%] w-[50%] rounded-xl bg-amber-300 justify-center items-center">
          <div>
          <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="New Password" className="border-2 rounded-sm h-10 w-80 2xl:h-15 2xl:w-120" />
          </div>

          <div>
            <input type="text" value={reEnterPass} onChange={(e) => setReEnterPass(e.target.value)} placeholder="Re-enter Password" className="border-2 rounded-sm h-10 w-80 2xl:h-15 2xl:w-120" />
          </div>


          <button type="submit" className="bg-green-500 h-10 w-20 2xl:h-15 2xl:w-25 rounded-sm transform transition hover:scale-110">Save</button>
          <button type="reset" onClick={handleClear} className="bg-red-500 h-10 w-20 2xl:h-15 2xl:w-25 rounded-sm transform transition hover:scale-110">Clear</button>
        </form>

        

    </div>

  </>)
} export default ResetPassword