import Form from "../components/Form";
import Bg from "../assets/loginbg.webp";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat h-[100vh] w-[100vw] relative"
      style={{ backgroundImage: `url(${Bg})` }}
    >
     <div className="translate-y-26"> 
    <Form route="/api/token/" method="login" />
  </div>
          <div className="absolute top-125  2xl:top-[70%] text-blue-500  w-fit ">
    <Link to="/forgotPassword">
      <p className="hover:underline">Forgot Password?</p>
    </Link>
    </div>
    </div>
  );
}

export default Login;
