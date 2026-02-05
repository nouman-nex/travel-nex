import React, { useEffect } from "react";

function Logout() {
  useEffect(() => {
    localStorage.removeItem("token");
    window.location.href = "/auth/login";
  }, []);
  return <div></div>;
}

export default Logout;
