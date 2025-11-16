import archivedUsersBG from "../assets/Admin/archivedUsersBG.webp";
import ArchivedUsersText from "../assets/Admin/ArchivedUsersText.webp";
import Back from "../components/Back";

function ArchivedUsers() {

  return <>
      <div className="h-[100vh] w-[100vw] absolute bg-cover bg-no-repeat flex justify-center overflow-hidden" style={{backgroundImage: `url(${archivedUsersBG})` }}>
          <Back/>
            <div className=" absolute 2xl:top-5 right-5"><img className="h-30 w-65  2xl:h-130 2xl:w-120" src={ArchivedUsersText} alt="" /></div>
           
          <div className="h-[90%] w-[80%] absolute top-[20%] place-self-center overflow-y-auto flex flex-col gap-2 ">
               <select className="bg-white h-10 rounded-sm p-2 w-fit text-2xl self-end ">
                <option value="all">Year</option>
              </select>
            <table className="w-full bg-amber-200 text-center">
              <tr>
                <th className="border-2 bg-amber-400 p-2 min-w-[120px]">Username</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[120px]">First Name</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[120px]">Last Name</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[180px]">Email</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[100px]">Role</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[150px]"> Schedule</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[130px]">Date Joined</th>
                  <th className="border-2 bg-amber-400 p-2 min-w-[150px]">Actions</th>
              </tr>
              <tr>
                <td className="border-2 p-2">user123</td>
                <td className="border-2 p-2">John</td>
                <td className="border-2 p-2">Doe</td>
                <td className="border-2 p-2"></td>
                <td className="border-2 p-2">user123</td>
                <td className="border-2 p-2">John</td>
                <td className="border-2 p-2">Doe</td>
                <td className="border-2 p-2"></td>
         
              </tr>
            </table>
          </div>
      
      </div>
    </>;
}
export default ArchivedUsers;