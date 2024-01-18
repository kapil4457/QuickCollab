"use client";
// import { useEffect, useState } from "react";
// import { TypeAnimation } from "react-type-animation";
// import Typewriter from "typewriter-effect";

import ReactRotatingText from "react-rotating-text";
export default function Home() {
  // const items = [
  //   { id: 0, content: "FIND JOBS" },
  //   { id: 1, content: "HIRE TALENT" },
  //   { id: 2, content: "LEVEL UP YOURSELF" },
  // ];

  return (
    <>
      <div
        id="first-section"
        className="flex h-[100vh] flex-col justify-center items-center text-5xl lg:gap-3"
      >
        <div
          style={{ fontWeight: 500, textAlign: "center" }}
          className="flex lg:text-5xl md:text-4xl text-3xl w-full self-center items-center justify-center"
        >
          One stop solution to{" "}
        </div>
        {/* <TypeAnimation
          sequence={[
            "FIND JOBS",
            1500,
            "HIRE TALENT",
            1500,
            "LEVEL UP",
            1500,
            () => {
              console.log("Sequence completed");
            },
          ]}
          wrapper="div"
          cursor={true}
          repeat={Infinity}
          style={{ fontWeight: "700", color: "orange" }}
          className="flex lg:text-8xl md:text-7xl text-5xl w-full self-center items-center justify-center"
        /> */}

        <span
          className="text-violet-600 dark:text-orange-500 flex lg:text-8xl md:text-7xl text-5xl  self-center items-center justify-center"
          style={{ fontWeight: 700 }}
        >
          <ReactRotatingText items={["FIND JOBS", "HIRE TALENT", "LEVEL UP"]} />
        </span>
      </div>
      <div id="section-section" className=""></div>
      <div id="third-section" className=""></div>
    </>
  );
}
