
import AuthForm from "@/components/auth/AuthForm";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  // This function is no longer needed as the AuthForm component 
  // now handles navigation directly
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-finny-purple to-finny-blue p-4">
      <div className="w-full max-w-md">
        <AuthForm />
      </div>
    </div>
  );
};

export default AuthPage;
