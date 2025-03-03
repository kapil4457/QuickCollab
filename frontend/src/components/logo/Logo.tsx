import "./Logo.css";
import { APPLICATION_NAME } from "@/constants/AppConstants";
import { Link } from "react-router-dom";

const Logo = ({
  externalTitleClass = "",
  externalDescClass = "",
  isTitleRequired = true,
}) => {
  return (
    <Link
      to={"/"}
      className={`flex flex-col justify-center items-center ${externalTitleClass}`}
    >
      <span className="logo-title text-xl md:text-2xl">{APPLICATION_NAME}</span>
      {isTitleRequired && (
        <span
          className={`logo-description text-base md:text-lg font-semibold ${externalDescClass}`}
        >
          Team Up, Dream Big
        </span>
      )}
    </Link>
  );
};

export default Logo;
