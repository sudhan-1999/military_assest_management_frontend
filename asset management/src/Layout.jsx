import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import Nav from "./Nav";

const Layout = () => {
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <>
      <Nav />
      <main className="container mt-4">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
