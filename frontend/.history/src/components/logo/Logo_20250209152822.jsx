import React from "react";
import "./Logo.css";
import { APPLICATION_NAME } from "../../constants/AppConstants";
import { space } from "postcss/lib/list";
const Logo = ({ className, isTitleRequired = true }) => {
  return (
    <span>
      <span className="logo-title">{APPLICATION_NAME}</span>;
      {isTitleRequired && (
        <span className="logo-description">Team Up, Dream Big</span>
      )}
    </span>
  );
};

export default Logo;
