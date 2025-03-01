import { logoutUserHandler } from "@/store/controllers/UserController";
import { useAppDispatch } from "@/store/hooks";
import showToast from "@/utils/showToast";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    logoutUserHandler(dispatch);
    showToast({ color: "success", title: "Logged out Successfully" });
    navigate("/");
  }, []);
  return <div>Logout</div>;
};

export default Logout;
