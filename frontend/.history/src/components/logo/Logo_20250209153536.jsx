import React from "react";
import "./Logo.css";
import { APPLICATION_NAME } from "../../constants/AppConstants";

const Logo = ({ externalTitleClass = "", isTitleRequired = true }) => {
  return (
    <span
      className={`flex flex-col justify-center items-center ${externalClass}`}
    >
      <span className="logo-title text-3xl">{APPLICATION_NAME}</span>
      {isTitleRequired && (
        <span className="logo-description font-bold">Team Up, Dream Big</span>
      )}
    </span>
  );
};

export default Logo;
