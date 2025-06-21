import React, { useState, useEffect } from "react";
import axios from "axios";


function Dashboard() {
  const [dashboard, setDashboard] = useState([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
const [showModal, setShowModal] = useState(false);


  const [filtered, setFiltered] = useState([]);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [base, setBase] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [typelist, setTypelist] = useState([]);
  const [baselist, setBaselist] = useState([]);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const authorizeroles = ["logistic officer", "admin", "commander"];

  const handleFilter = () => {
    const result = purchase.filter((item) => {
      console.log("Filtering type:", type);
      const matchType = type
        ? item.Type?.toLowerCase() === type.toLowerCase()
        : true;
      const matchDate = date ? item.PurchaseDate?.slice(0, 10) === date : true;
      return matchType && matchDate;
    });

    useEffect(() => {
      const rawData = localStorage.getItem("dashboardData");
      const parsed = rawData ? JSON.parse(rawData) : [];
      const base = [...new Set(parsed.map((item) => item.Base))];
      const types = [...new Set(parsed.map((item) => item.Type))];
      setTypelist(types);
      setBaselist(base);
    }, []);
    setFiltering(true);
    setFiltered(result);
  };

const fetchDashboard = async () => {
  const details = localStorage.getItem("dashboardData");
  const isReload = performance.getEntriesByType("navigation")[0]?.type === "reload";

  if (details) {
    const parsedDetails = JSON.parse(details);
    setDashboard(parsedDetails);
    setLoading(false);
  } else {
    try {
      const response = await axios.get("http://localhost:3000/api/dashboard", {
        headers: { Authorization: token },
      });
      setDashboard(response.data);
      localStorage.setItem("dashboardData", JSON.stringify(response.data));
    } catch (error) {
      console.error("Error fetching dashboard data", error);
    } finally {
      setLoading(false);
    }
  }
};


useEffect(() => {
  fetchDashboard();
}, [role, token]);


  return (
    <>
      <div className="container">
        <h4>Filter Purchase History</h4>
        <div className="row mb-3">
          <div className="col">
            <select
              id="weapon"
              className="form-select"
              value={base}
              onChange={(e) => setBase(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {baselist.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <select
              id="weapon"
              className="form-select"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {typelist.map((t, index) => (
                <option key={index} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="col">
            <input
              type="date"
              className="form-control"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={handleFilter}>
              Apply Filter
            </button>
          </div>
        </div>
      </div>

      {/*<div className="container-md">
      
        <div className="row">
          {filtered.length === 0 && (
            <p className="text-center" style={{ color: "red" }}>
              No Dashboard history available.
            </p>
          )}
          {loading ? (
            <div className="spinner-border m-5" role="status">
  <span className="sr-only"></span>
</div>
          ) : (
            (filtering ? filtered : dashboard).map((item, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 mb-4"
                key={item._id || index}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Weapon: {item.Weapon}</h5>
                    <p className="card-text">OpeningBalance: {item.OpeningBalance}</p>
                    <p className="card-text">AssignedBy: {item.AssignedBy}</p>
                    <p className="card-text">PurchaseQuantity: {item.PurchaseQty}</p>
                    <p className="card-text">TransferedIn: {item.TransferedIn}</p>
                    <p className="card-text">TransferedOut: {item.TransferedOut}</p>
                    <p className="card-text">AssignedQuantity: {item.AssignedQuantity}</p>
                    <p className="card-text">ExpendedQuantity: {item.ExpendedQuantity}</p>
                    <p className="card-text">NetMovement: {item.NetMovement}</p>
                    <p className="card-text">Base: {item.Base}</p>
                  </div>
                </div>
              </div>
          ))
          ): (
      <p className="text-danger text-center">No dashboard data available</p>
    )}
        </div>
      </div>*/}
      <div className="container-md">
        <div className="row">
          {loading ? (
            <div className="spinner-border m-5" role="status">
              <span className="sr-only"></span>
            </div>
          ) : (filtering ? filtered : dashboard)?.length === 0 ? (
            <p className="text-danger text-center w-100">
              No Dashboard history available.
            </p>
          ) : (
            (filtering ? filtered : dashboard).map((item, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 mb-4"
                key={item._id || index}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Weapon: {item.Weapon}</h5>
                    <p className="card-text">
                      OpeningBalance: {item.OpeningBalance}
                    </p>
                    <p className="card-text">
                      ClosingBalance: {item.ClosingBalance}
                    </p>
                    <p className="card-text">
                      AssignedQuantity: {item.AssignedQuantity}
                    </p>
                    <p className="card-text">
                      ExpendedQuantity: {item.ExpendedQuantity}
                    </p>
                    <p
                      className="card-text text-primary"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setSelectedItem(item);
                        setShowModal(true);
                      }}
                    >
                      NetMovement: {item.NetMovement}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        {showModal && selectedItem && (
  <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
    <div className="modal-dialog" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Details for {selectedItem.Weapon}</h5>
          <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
        </div>
        <div className="modal-body">
          <p>PurchaseQuantity: {selectedItem.PurchaseQty}</p>
          <p>TransferedIn: {selectedItem.TransferedIn}</p>
          <p>TransferedOut: {selectedItem.TransferedOut}</p>
        </div>
        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
)}

      </div>
    </>
  );
}

export default Dashboard;
