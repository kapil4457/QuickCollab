import { Button, CloseIcon } from "@mantine/core";
import React from "react";

const PopUpBase = ({ children, setIsOpen, isDisabled = false }) => {
  return (
    <div className="z-[2] absolute top-0 left-0 right-0 bottom-0  p-[10%]  flex justify-center">
      <div className="relative bg-gray-700 p-[5%] w-[70%] rounded-lg h-[40rem]   text-white">
        <Button
          disabled={isDisabled}
          className="absolute! top-[1rem]! right-[2rem]!"
          variant="light"
          onClick={() => setIsOpen(false)}
        >
          <CloseIcon className="w-[1.5rem]! h-[1.5rem]!" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default PopUpBase;
