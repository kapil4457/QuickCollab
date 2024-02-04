import React from "react";
import { Instagram, Twitter, Mail, LinkedIn } from "@mui/icons-material";
const Footer = () => {
  return (
    <footer className="flex flex-col bg-[#1f2937] dark:bg-slate-700 p-10 gap-5">
      <div className="flex justify-between items-center">
        <div className="logo flex  justify-center items-center gap-2">
          <img src="/logo3.png" alt="QuickCollab" className="h-20 w-20" />
          <span
            className="text-white text-2xl mt-10 "
            style={{ fontWeight: "700" }}
          >
            {" "}
            QuickCollab
          </span>
        </div>
        <div className="socials text-white flex gap-3 justify-center items-center">
          <a href="https://www.instagram.com/kapilsoni4457/">
            <Instagram className="h-7 w-7 cursor-pointer hover:text-orange-300" />
          </a>
          <a href="https://twitter.com/kapil54768161">
            <Twitter className="h-7 w-7 cursor-pointer hover:text-orange-300" />
          </a>
          <a href="https://www.linkedin.com/in/kapil-soni-2b25981ab/">
            <LinkedIn className="h-7 w-7 cursor-pointer hover:text-orange-300" />
          </a>
          <a href="mailto:kapilsoni54768161@gmail.com">
            <Mail className="h-7 w-7 cursor-pointer hover:text-orange-300" />
          </a>
        </div>
      </div>
      <div
        className="w-[90%] h-2 self-center"
        style={{ borderBottom: "1px solid white" }}
      />
      <p className="w-full justify-center items-center text-center text-white font-bold">
        © 2023 <a href="/">QuickCollab </a> All rights Reserved
      </p>
    </footer>
  );
};

export default Footer;
