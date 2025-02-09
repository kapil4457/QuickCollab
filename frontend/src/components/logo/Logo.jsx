import React from "react";
import "./Logo.css";
import { APPLICATION_NAME } from "../../constants/AppConstants";

const Logo = ({
  externalTitleClass = "",
  externalDescClass = "",
  isTitleRequired = true,
}) => {
  return (
    <span
      className={`flex flex-col justify-center items-center ${externalTitleClass}`}
    >
      <span className="logo-title text-3xl">{APPLICATION_NAME}</span>
      {isTitleRequired && (
        <span className={`logo-description font-bold ${externalDescClass}`}>
          Team Up, Dream Big
        </span>
      )}
    </span>
  );
};

export default Logo;
