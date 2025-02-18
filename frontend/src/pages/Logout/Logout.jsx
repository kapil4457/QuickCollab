import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateCurrentUserState } from "../../store/slices/userSlice";
import { Loader } from "@mantine/core";
import { logoutUserController } from "../../controller/UserController";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { updateUserListedJobs } from "../../store/slices/jobSlice";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwtToken = useSelector((state) => state.user.jwtToken);
  const logoutHandler = async () => {
    try {
      const response = await logoutUserController(jwtToken);
      const { success, message } = response.data;
      if (success) {
        toast.success(message);
      } else {
        toast.error(message);
      }
    } catch (err) {
      toast.error(err.response.data.message);
    }
    dispatch(
      updateCurrentUserState({
        user: null,
        isAuthenticated: false,
        jwtToken: null,
      })
    );
    dispatch(
      updateUserListedJobs({
        userListedJobs: [],
      })
    );
    navigate("/");
  };
  useEffect(() => {
    logoutHandler();
  }, []);
  return (
    <div className="flex gap-2 justify-center items-center h-full w-full">
      <Loader />
      <span className="text-xl">Logging you out...</span>
    </div>
  );
};

export default Logout;
