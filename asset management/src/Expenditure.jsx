import React, { useState, useEffect } from "react";
import axios from "axios";



function Expenditure() {
    const [weapon, setWeapon] = useState("");
    const [quantity, setQuantity] = useState("");
    const [reason, setReason] = useState("");
    const [base, setBase] = useState("");
    const[expendedhistory,setExpendedhistory] = useState([]);
      const [loading, setLoading] = useState(true);

      const [weaponList, setWeaponList] = useState([]);

      const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const expendBy = localStorage.getItem("userId");
  const authorizeroles = ["admin", "commander"];

       useEffect(() => {
          const rawData = localStorage.getItem("purchasehistory");
          const parsed = rawData ? JSON.parse(rawData) : [];
          const weapons = [...new Set(parsed.map((item) => item.Weapon))];
          setWeaponList(weapons);
        }, []);

        const fetchexpendedHistory = async () => {
      if (authorizeroles.includes(role)) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/expendedassets",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setExpendedhistory(response.data);
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
    fetchexpendedHistory();
  }, [role, token]);

    const toExpendasset=async ()=>{
        console.log(weapon,quantity,reason,base)
        try {
           const response= await axios.post(
        "http://localhost:3000/api/expendedasset",
        {
          Weapon:weapon,
        Quantity:quantity,
        Reason:reason,
        Base:base,
        },
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setWeapon("");
      setQuantity("");
      setReason("");
      setBase("");
      console.log("Asset expended successfully", response.data);
      alert("Asset expended successfully");
      fetchexpendedHistory();
      
      
        }catch (error) {
            console.error("Error expending asset", error);
            alert(error.response.data.message)
        }
    }
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
         <div className="col-12 col-md">
          <input
            id="reason"
            type="text"
            placeholder="Enter Reason"
            className="form-control"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>
        <div className="col d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={toExpendasset}>
            Expend Asset
          </button>
        </div>
        <h5 className="text-center">Expended History</h5>
<div className="container-md">
        <div className="row">
          {expendedhistory.length === 0 && (
            <p className="text-center" style={{ color: "red" }}>
              No Expended history available.
            </p>
          )}
          {loading ? (
              <div className="spinner-border m-5" role="status">
  <span className="sr-only"></span>
</div>
          ) : (
            expendedhistory.map((item, index) => (
              <div
                className="col-12 col-sm-6 col-md-4 mb-4"
                key={item._id || index}
              >
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">Weapon: {item.Weapon}</h5>
                    <p className="card-text">Type: {item.Type}</p>
                    <p className="card-text">Quantity: {item.Quantity}</p>
                    <p className="card-text">Reason: {item.Reason}</p>
                    <p className="card-text">Base: {item.Base}</p>
                    <p className="card-text">Expended By: {item.ExpendedBy}</p>
                    <p className="card-text">Expended Date: {item.ExpendedDate}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
         </div>
        </>
  )
}

export default Expenditure