import React from "react";
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

const FooterComp = () => {
  return (
    <Footer
      container
      className="mt-20 "
      style={{ borderTop: "2px solid rgba(0,0,0,0.2)" }}
    >
      <div className="w-full text-center">
        <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
          <FooterBrand
            href="/"
            src="/logo3.png"
            alt="CMS Logo"
            name="Content Management System"
          />
          <FooterLinkGroup>
            <FooterLink href="/about">About</FooterLink>
            <FooterLink href="/privacy-policy">Privacy Policy</FooterLink>
            <FooterLink href="/licensing">Licensing</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterLinkGroup>
        </div>
        <FooterDivider />
        <FooterCopyright href="#" by="Content Management System" year={2024} />
      </div>
    </Footer>
  );
};

export default FooterComp;
