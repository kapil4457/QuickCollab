import React from "react";
import "./Logo.css";
import { APPLICATION_NAME } from "../../constants/AppConstants";
const Logo = () => {
  return <span className="logo-title">{APPLICATION_NAME}</span>;
};

export default Logo;
