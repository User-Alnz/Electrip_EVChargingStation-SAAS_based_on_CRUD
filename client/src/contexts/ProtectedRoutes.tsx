import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ children } : { children: JSX.Element }) 
{
  const { auth } = useAuth();

  if(!auth)
    return <Navigate to="/" replace /> // "replace" don't add a new entry in the browser's history stack. so impossible to get back previous page

  return children;
}