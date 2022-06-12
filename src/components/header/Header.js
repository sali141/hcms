import React from "react";
import logo from "../../assets/img/logo.png"
export const Header = () => {
  return (
    <div className="header">
      <h1>HCMS Service</h1>
      <div className="logo">
        <img className="logo-img" src={logo} alt="logo" />
      </div>
    </div>
  );
};
