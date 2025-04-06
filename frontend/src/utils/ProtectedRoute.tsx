import { useAppSelector } from "@/store/hooks";
import {
  selectLoggedInUser,
  selectUserLoadingState,
} from "@/store/slices/userSlice";
import { Navigate } from "react-router-dom";
import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";

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
  const isLoading = useAppSelector(selectUserLoadingState);
  const authToken = localStorage.getItem(AUTHORIZATION_TOKEN);
  return user &&
    (isAccessibleToAll
      ? true
      : requiredRole.includes(user?.userRole?.toString())) ? (
    children
  ) : (
    <>{isLoading || authToken ? children : <Navigate to="/login" />}</>
  );
};

export default ProtectedRoute;
