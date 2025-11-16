import Back from "../components/Back";
import ArchivedChildrenBg from "../assets/TeacherHomePage/ArchivedChildrenBg.webp";
function TeacherArchivedChildren() {

  return (
    <div className="h-[100vh] w-[100vw] absolute bg-cover bg-no-repeat flex justify-center" style={{backgroundImage: `url(${ArchivedChildrenBg})`}}>
       <Back/>
      <div className="h-fit w-[80%] absolute top-[20%] place-self-center overflow-y-auto flex flex-col gap-2">
        <select className="bg-white h-10 rounded-sm p-2 w-fit text-2xl self-end ">
                <option value="all">Year</option>
        </select>
        <table className="w-full bg-amber-200 text-center">
           <tr className="font-bold border-2 text-2xl">
                    <th className="border-2 bg-amber-400 w-[20%] p-2">Name</th>
                    <th className="border-2 bg-amber-400 w-[15%] p-2">Section</th>
                    <th className="border-2 bg-amber-400 w-[20%] p-2">Schedule</th>
                    <th className="border-2 bg-amber-400 w-[15%] p-2">Birthday</th>
                    <th className="border-2 bg-amber-400 w-[25%] 2xl:w-[20%] p-2">Parent/Guardian</th>
            </tr>

            <tr>

              <td className="border-2 p-2">Jane Doe</td>
              <td className="border-2 p-2">Section A</td>
              <td className="border-2 p-2">MWF 9:00-10:00 AM</td>
              <td className="border-2 p-2">01/15/2018</td>
              <td className="border-2 p-2">John Doe</td>
         
            </tr>
        </table>
      </div>
    </div>
  );
}

export default TeacherArchivedChildren;