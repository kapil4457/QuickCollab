"use client";
import { fetchServiceProviders } from "@/redux/slices/serviceSlice";
import { useAppSelector } from "@/redux/store";
import { CONTENT_CREATOR } from "@/utils/roles";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Table from "./Table";

const page = () => {
  const dispatch = useDispatch();
  const [filters, setFilters] = useState([]);
  const router = useRouter();
  const { users, loading } = useAppSelector(
    (state) => state.serviceSlice.value
  );
  const { isAuthenticated, user } = useAppSelector(
    (state) => state.userSlice.value
  );
  useEffect(() => {
    // dispatch(fetchServiceProviders());
    dispatch(fetchServiceProviders(filters));
  }, [filters]);
  return (
    <div className="h-[100vh] w-full mt-[15rem] flex justify-center">
      <Table users={users} />
    </div>
  );
};

export default page;
