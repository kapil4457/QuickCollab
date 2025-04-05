import { useAppSelector } from "@/store/hooks";
import { selectLoggedInUser } from "@/store/slices/userSlice";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({
  children,
  requiredRole,
  isAccessibleToAll,
}: {
  children: JSX.Element;
  requiredRole: string[];
  isAccessibleToAll: boolean;
}) => {
  const user = useAppSelector(selectLoggedInUser);
  return user &&
    (isAccessibleToAll
      ? true
      : requiredRole.includes(user?.userRole?.toString())) ? (
    children
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoute;
