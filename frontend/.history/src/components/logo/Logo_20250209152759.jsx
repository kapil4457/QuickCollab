import React from "react";
import "./Logo.css";
import { APPLICATION_NAME } from "../../constants/AppConstants";
import { space } from "postcss/lib/list";
const Logo = ({ className, isTitleRequired = false }) => {
  return (
    <span>
      <span className="logo-title">{APPLICATION_NAME}</span>;
      <span className="logo-description">Team Up, Dream Big</span>
    </span>
  );
};

export default Logo;
