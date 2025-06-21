import React, { useState, useEffect } from "react";
import axios from "axios";

function Transfer() {
  //Weapon, Type, Quantity, FromBase, ToBase, TransferredBy
  const [transfered, setTransfered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [weapon, setWeapon] = useState("");
  const [weaponList, setWeaponList] = useState([]);

  const [quantity, setQuantity] = useState("");
  const [base, setBase] = useState("");
  
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const frombase = localStorage.getItem("base");
  const TransferredBy = localStorage.getItem("userId");

  const authorizeroles = ["logistic officer", "admin", "commander"];

  console.log("role", role);
  console.log("token", token);
  console.log("frombase", frombase);
  console.log("TransferredBy", TransferredBy);

  useEffect(() => {
    const rawData = localStorage.getItem("purchasehistory");
    const parsed = rawData ? JSON.parse(rawData) : [];

    const weapons = [...new Set(parsed.map((item) => item.Weapon))];
    setWeaponList(weapons);
  }, []);

const fetchtransferHistory = async () => {
      if (authorizeroles.includes(role)) {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/transfered",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setTransfered(response.data);
          setLoading(false);
          localStorage.setItem("TransferedData", JSON.stringify(response.data));
          console.log("Transfer history fetched successfully", response.data);
        } catch (error) {
          console.error("Error fetching purchase history", error);
        }
      } else {
        console.warn("Unauthorized access");
      }
    };

    useEffect(() => {
    fetchtransferHistory();
  }, [role, token]);

  const Transferasset = async () => {
    if (authorizeroles.includes(role)) {
      try {
        const response = await axios.post(
          "http://localhost:3000/api/transfer",
          {
            Weapon: weapon,
            Quantity: quantity,
            FromBase: frombase,
            ToBase: base,
            TransferredBy: TransferredBy,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        console.log("Transfer successful", response.data);
        setWeapon("");
        setQuantity("");
        setBase("");
        alert("Asset transferred successfully");
        fetchtransferHistory();
      } catch (error) {
        console.error("Error transferring asset", error);
        if (error.message == "Request failed with status code 400") {
          alert("Insufficient quantity available for transfer");
        } else {
          alert("An unexpected error occurred.");
        }
      }
    } else {
      console.warn("Unauthorized access");
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
            placeholder="Enter ToBase"
            className="form-control"
            value={base}
            onChange={(e) => setBase(e.target.value)}
          />
        </div>

        <div className="col d-flex align-items-end">
          <button className="btn btn-primary w-100" onClick={Transferasset}>
            Transfer
          </button>
        </div>
      </div>

      {loading ? (
        <div className="spinner-border m-5" role="status">
  <span className="sr-only"></span>
</div>
      ) : (
        <>
          <h5 className="text-center">Transfer History</h5>
          <div className="container-md">
            <div className="row">
            {transfered.map((transfer, index) => {
              return (
                <div
                  className="col-12 col-sm-6 col-md-4 mb-4"
                  key={transfer._id || index}
                  id="transfer-card"
                >
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Weapon: {transfer.Weapon}</h5>
                      <p className="card-text">Type: {transfer.Type}</p>
                      <p className="card-text">Quantity: {transfer.Quantity}</p>
                      <p className="card-text">FromBase: {transfer.FromBase}</p>
                      <p className="card-text">ToBase: {transfer.ToBase}</p>
                      <p className="card-text">
                        TransferedBy: {transfer.TransferredBy}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Transfer;
