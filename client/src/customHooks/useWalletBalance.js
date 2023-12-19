// To make my code cleaner and also practice custom hook from professor's lecture code
// I will be using this custom hook to get wallet balance

import React, { useState, useEffect } from "react";
import { getWalletBalance } from "../firebase/ParentFunctions";

const useWalletBalance = (userId) => {
  // Here I will define my local useStates
  const [totalBalance, setTotalBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // writing this useEffect hook to get balance of the loggedin parent user
  useEffect(() => {
    const fetchWalletBalance = async () => {
      try {
        console.log("Use effect fired!!!");

        // Initializing my loading
        setLoading(true);
        const fetchedBalance = await getWalletBalance(userId);
        setTotalBalance(fetchedBalance);
      } catch (error) {
        setError({
          message: "Error fetching parent wallet balance",
          error: error,
        });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchWalletBalance();
    }
  }, [userId]);

  return { totalBalance, loading, error };
};

export default useWalletBalance;
