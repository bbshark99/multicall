import React, { useState } from "react";
import { useChain } from "./context/chain";
import { SUPPORTED_TOKENS } from "./config/constants";

import "./App.css";

const App = () => {
  const { balances, error, loadingBalances, fetchBalances } = useChain();
  const [address, setAddress] = useState<string>("");

  const handleChange = (el: any) => setAddress(el.target.value);

  const handleKeyDown = (event: any) => {
    if (event.keyCode === 13) {
      address && fetchBalances(address);
    }
  };

  return (
    <div className="App Container">
      <div className="Container">
        <p>Input the wallet address</p>
        <input
          type="text"
          value={address}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        />
      </div>

      <div className="Container">
        {loadingBalances && <div className="Loader">Loading Balances....</div>}
        {error && <div className="Error">{error}</div>}
        {SUPPORTED_TOKENS.map((token) => (
          <p>
            <strong>{token}:</strong> {balances[token] || "0.0000"}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
