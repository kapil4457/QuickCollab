import { Link } from "@heroui/link";
import Logo from "../logo/Logo";
import { Mail, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t-2 py-8 px-6 md:px-16 bg-background">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Side */}
        <div className="flex flex-col items-center text-center md:text-left space-y-3">
          <Logo isTitleRequired={false} />
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Kapil Soni. All rights reserved.
          </p>
        </div>

        {/* Right Side */}
        <div className="text-center md:text-right space-y-2 flex flex-col">
          <p className="text-md font-semibold tracking-wide">
            Designed & Developed by
            <span className="text-blue-400"> Kapil Soni</span>
          </p>
          <Link
            href="mailto:kapilsoni54768161@gmail.com"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200"
          >
            <Mail size={16} />
            kapilsoni54768161@gmail.com
          </Link>
          <Link
            href="https://www.linkedin.com/in/kapil-soni-2b25981ab/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors duration-200"
          >
            <Linkedin size={16} />
            linkedin.com/in/kapil-soni
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
