import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Nav() {
  const [isadmin, setIsadmin] = useState(false);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/");
    collapseNavbar(); 
  };

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role === "admin") {
      setIsadmin(true);
    }
  }, []);

  
  const collapseNavbar = () => {
    const navbar = document.getElementById("navbarNav");
    if (navbar && navbar.classList.contains("show")) {
      const bsCollapse = new window.bootstrap.Collapse(navbar, {
        toggle: true,
      });
      bsCollapse.hide();
    }
  };


  const handleNavClick = (path) => {
    navigate(path);
    collapseNavbar();
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <span className="navbar-brand">Military Asset Manager</span>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick("/dashboard")}
              >
                Dashboard
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick("/purchase")}
              >
                Purchase
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick("/transfer")}
              >
                Transfer
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick("/assign")}
              >
                Assignment
              </button>
            </li>
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={() => handleNavClick("/expend")}
              >
                Expend
              </button>
            </li>
            {isadmin && (
              <li className="nav-item">
                <button
                  className="nav-link btn btn-link text-white"
                  onClick={() => handleNavClick("/regiteruser")}
                >
                  Register user
                </button>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button
                className="nav-link btn btn-link text-white"
                onClick={logout}
              >
                Log out
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Nav;

