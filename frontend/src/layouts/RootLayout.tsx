import { AUTHORIZATION_TOKEN } from "@/constants/AppConstants";
import { selfDetails } from "@/store/controllers/UserController";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const fetchSelfDetails = async () => {
    let jwtToken = localStorage.getItem(AUTHORIZATION_TOKEN);
    if (jwtToken) {
      const response = await selfDetails(dispatch, jwtToken);
      if (!response?.success) {
        navigate("/logout");
      }
    }
  };
  useEffect(() => {
    fetchSelfDetails();
  }, []);
  return <div>{children}</div>;
}
