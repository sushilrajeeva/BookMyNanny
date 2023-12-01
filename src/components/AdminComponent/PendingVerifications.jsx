import React, { useEffect, useState } from 'react';
import {getPendingVerifications, VerifyNanny } from '../../firebase/AdminFunctions';

function PendingVerifications() {
  const [pending, setPending] = useState([]);

  useEffect(() => {
    const fetchPendingVerifications = async () => {
      try {
        const pendingVerifications = await getPendingVerifications();
        setPending(pendingVerifications);
      } catch (error) {
        console.error('Error fetching listings:', error);
      }
    };

    fetchPendingVerifications();
  }, []);

  const handleVerifyNanny = async (nannyId) => {
    try {
      await VerifyNanny(nannyId);

      const updatedPendingVerifications = await getPendingVerifications();
      setPending(updatedPendingVerifications);
    } catch (error) {
      console.error('Error verifying nanny:', error);
    }
  };

  return (
    <div>
      <h1>Pending Verifications</h1>
      <ul>
        {pending.map((nanny) => (
          <li key={nanny._id}>
            <p>{nanny.firstName}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
              <button 
                onClick={() => handleVerifyNanny(nanny._id)}
                style={{ padding: '10px 15px', borderRadius: '5px', flex: '1', marginRight: '5px' }}
              >
                Verify Nanny
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PendingVerifications;
