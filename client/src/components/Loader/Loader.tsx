import React from "react";
import { ThreeDots } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className="w-full h-full absolute top-0 bottom-0 left-0 right-0 flex justify-center items-center bg-slate-50 z-50 opacity-70">
      {/* <LineWave
        visible={true}
        height="200"
        width="200"
        // color="#4fa94d"
        color="blue"
        ariaLabel="line-wave-loading"
        wrapperStyle={{}}
        wrapperClass=""
        firstLineColor="purple"
        middleLineColor="blue"
        lastLineColor="orange"
      /> */}
      <ThreeDots
        visible={true}
        height="80"
        width="80"
        color="orange"
        radius="9"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default Loader;
