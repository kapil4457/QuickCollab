import "./Logo.css";
import { APPLICATION_NAME } from "@/constants/AppConstants";

const Logo = ({
  externalTitleClass = "",
  externalDescClass = "",
  isTitleRequired = true,
}) => {
  return (
    <div
      className={`flex flex-col justify-center items-center ${externalTitleClass}`}
    >
      <span className="logo-title text-2xl md:text-3xl">
        {APPLICATION_NAME}
      </span>
      {isTitleRequired && (
        <span className={`logo-description s font-bold ${externalDescClass}`}>
          Team Up, Dream Big
        </span>
      )}
    </div>
  );
};

export default Logo;
