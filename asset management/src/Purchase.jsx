import React, { useState, useEffect } from "react";
import axios from "axios";

function Purchase() {
  const [weapon, setWeapon] = useState("");
  const [purchasetype, setPurchasetype] = useState("");
  const [quantity, setQuantity] = useState("");
  const [base, setBase] = useState("");

  const [purchase, setPurchase] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [type, setType] = useState("");
  const [date, setDate] = useState("");
  const [filtering, setFiltering] = useState(false);
  const [typelist, setTypelist] = useState([]);

  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");
  const authorizeroles = ["logistic officer", "admin", "commander"];

  useEffect(() => {
    const rawData = localStorage.getItem("purchaseData");
    const parsed = rawData ? JSON.parse(rawData) : [];
    const types = [...new Set(parsed.map((item) => item.Type))];
    setTypelist(types);
  }, []);
  

  const fetchPurchaseHistory = async () => {
      if (authorizeroles.includes(role)) {
        try {
          const response = await axios.get(
            "https://miltary-assest-managemnet-backend.onrender.com/api/purchasehistory",
            {
              headers: {
                Authorization: token,
              },
            }
          );
          setPurchase(response.data);
          setFiltered(response.data);
          localStorage.setItem("purchaseData", JSON.stringify(response.data));
        } catch (error) {
          console.error("Error fetching purchase history", error);
        }
      } else {
        console.warn("Unauthorized access");
      }
    };


  useEffect(() => {
    fetchPurchaseHistory();
  }, [role, token]);

  const purchasingnew = async () => {
    if (authorizeroles.includes(role)) {
      try {
        const response = await axios.post(
          "https://miltary-assest-managemnet-backend.onrender.com/api/purchase",
          {
            Weapon: weapon,
            Type: purchasetype,
            Quantity: quantity,
            Base: base,
          },
          {
            headers: {
              Authorization: token,
            },
          }
        );
        
        setWeapon("");
        setPurchasetype("");
        setQuantity("");
        setBase("");
        alert("Purchase successful");
        fetchPurchaseHistory(); 
      } catch (error) {
        console.error("Error making purchase", error);
      }
    }
  };
  const handleFilter = () => {
    const result = purchase.filter((item) => {
     
      const matchType = type
        ? item.Type?.toLowerCase() === type.toLowerCase()
        : true;
      const matchDate = date ? item.PurchaseDate?.slice(0, 10) === date : true;
      return matchType && matchDate;
    });

    setFiltering(true);
    setFiltered(result);
  };

  return (
    <>
      <div className="container">
  <h4>New Purchase</h4>
  <div className="row mb-3 g-2">
    <div className="row mb-3 g-2">
      <input
        id="weapon"
        type="text"
        placeholder="Enter Weapon Name"
        className="form-control"
        value={weapon}
        onChange={(e) => setWeapon(e.target.value)}
      />
    </div>

    <div className="col-12 col-md">
      <input
        id="type"
        type="text"
        placeholder="Enter Type"
        className="form-control"
        value={purchasetype}
        onChange={(e) => setPurchasetype(e.target.value)}
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

    <div className="col-12 col-md d-flex align-items-end">
      <button className="btn btn-primary w-100" onClick={purchasingnew}>
        Purchase
      </button>
    </div>
  </div>
</div>


      <div className="container">
        <h4>Filter Purchase History</h4>
        <div className="row mb-3">
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

      <h5 className="text-center">Purchase History</h5>

      <div className="container-md">
        <div className="row">
          {filtered.length === 0 && (
            <p className="text-center" style={{ color: "red" }}>
              No purchase history available.
            </p>
          )}
          {(filtering ? filtered : purchase).map((item, index) => (
            <div
              className="col-12 col-sm-6 col-md-4 mb-4"
              key={item._id || index}
            >
              <div className="card h-100 shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">Weapon: {item.Weapon}</h5>
                  <p className="card-text">Type: {item.Type}</p>
                  <p className="card-text">Quantity: {item.Quantity}</p>
                  <p className="card-text">Base: {item.Base}</p>
                  <p className="card-text">
                    Purchase Date: {item.PurchaseDate?.slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Purchase;
