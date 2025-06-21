import React, { useState, useEffect } from "react";
import axios from "axios";

function Assign() {
  const [weapon, setWeapon] = useState("");
  const [quantity, setQuantity] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [base, setBase] = useState("");
  const [loading, setLoading] = useState(true);

  const [weaponList, setWeaponList] = useState([]);
  const [assignedhistory, setassignedhistory] = useState([]);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const assignedBy = localStorage.getItem("userId");
  const authorizeroles = ["admin", "commander"];

  useEffect(() => {
    const rawData = localStorage.getItem("purchasehistory");
    const parsed = rawData ? JSON.parse(rawData) : [];

    const weapons = [...new Set(parsed.map((item) => item.Weapon))];
    setWeaponList(weapons);
  }, []);

   const fetchtassignHistory = async () => {
      if (authorizeroles.includes(role)) {
        try {
          const response = await axios.get(
            "https://miltary-assest-managemnet-backend.onrender.com/api/assigned",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setassignedhistory(response.data);
          setLoading(false);
          localStorage.setItem(
            "assignedhistory",
            JSON.stringify(response.data)
          );
          console.log("Assigned history fetched successfully", response.data);
        } catch (error) {
          console.error("Error fetching purchase history", error);
        }
        finally {
        setLoading(false); 
      }
      } else {
        console.warn("Unauthorized access");
         setLoading(false);
      }
    };
   useEffect(() => {
    fetchtassignHistory();
  }, [role, token]);

  const toAssignasset = async () => {
    try {
      await axios.post(
        "https://miltary-assest-managemnet-backend.onrender.com/api/assign",
        {
          Weapon: weapon,
          Quantity: quantity,
          AssignedTo: assignedTo,
          AssignedBy: assignedBy,
          Base: base,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setWeapon("");
      setQuantity("");
      setAssignedTo("");
      setBase("");
      alert("Assignment successful");
      await fetchtassignHistory();
      
    } catch (error) {
      console.error("Error assigning asset", error);
    }
  };
 
  return (
    <>
      <div className="row mb-3 g-2">
        <div className="col-12 col-md">
          <select
            id="weapon"
            className="form-select"
            value={weapon}
            onChange={(e) => setWeapon(e.target.value)}
          >
            <option value="">-- Select Weapon --</option>
            {weaponList.map((w, index) => (
              <option key={index} value={w}>
                {w}
              </option>
            ))}
          </select>
        </div>
        <div className="col-12 col-md">
          <input
            id="assignedTo"
            type="text"
            placeholder="Enter Name of Person"
            className="form-control"
            value={assignedTo}
            onChange={(e) => setAssignedTo(e.target.value)}
          />
        </div>
        <div className="col-12 col-md">
          <input
            id="quantity"
            type="number"
            placeholder="Enter Quantity"
            className="form-control"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
        <div className="col-12 col-md">
          <input
            id="base"
            type="text"
            placeholder="Enter Base"
            className="form-control"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />
        </div>
        <div className="col d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={toAssignasset}>
            Assign
          </button>
        </div>
      </div>
      <h5 className="text-center">Assigned History</h5>

      <div className="container-md">
        <div className="row">
          {assignedhistory.length === 0 && (
            <p className="text-center" style={{ color: "red" }}>
              No Assigned history available.
            </p>
          )}
          {loading ? (
            <div className="spinner-border m-5" role="status">
  <span className="sr-only"></span>
</div>
          ) : (
            assignedhistory.map((item, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 mb-4"
                key={item._id || index}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Weapon: {item.Weapon}</h5>
                    <p className="card-text">Type: {item.AssignedTo}</p>
                    <p className="card-text">AssignedBy: {item.AssignedBy}</p>
                    <p className="card-text">Base: {item.Base}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default Assign;
