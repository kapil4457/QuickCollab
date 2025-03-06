import { Spinner } from "@heroui/spinner";
import { selectUserLoadingState } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";
import clsx from "clsx";
import { selectAllJobsLoading } from "@/store/slices/jobSlice";

const LoaderOverlay = () => {
  const isUserLoading = useAppSelector(selectUserLoadingState);
  // const isJobLoading = useAppSelector(selectAllJobsLoading);
  return (
    <div
      id="loader-overlay"
      className={clsx(
        "absolute inset-0 flex justify-center items-center z-[99999999]",
        "bg-black bg-opacity-75 backdrop-blur-sm",
        isUserLoading ? "flex" : "hidden"
      )}
    >
      <Spinner color="primary" labelColor="foreground" label="Loading..." />
    </div>
  );
};

export default LoaderOverlay;
