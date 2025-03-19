import { Spinner } from "@heroui/spinner";
import { selectUserLoadingState } from "@/store/slices/userSlice";
import { useAppSelector } from "@/store/hooks";
import clsx from "clsx";

const LoaderOverlay = () => {
  const isUserLoading = useAppSelector(selectUserLoadingState);
  return (
    <div
      // id="loader-overlay"
      className={clsx(
        "fixed top-0 bottom-0 right-0 left-0 bg-black bg-opacity-75 backdrop-blur-sm z-[99999999]  flex justify-center items-center",
        isUserLoading ? "flex" : "hidden"
      )}
    >
      <Spinner color="primary" labelColor="foreground" label="Loading..." />
    </div>
  );
};

export default LoaderOverlay;
