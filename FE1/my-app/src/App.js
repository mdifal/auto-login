import React, { useState } from 'react';
import axios from 'axios';




const AutoLoginButton = () => {
  const [loading, setLoading] = useState(false);
  

  const handleLoginClick = async () => {
    setLoading(true);

    try {
      // Kirim request ke backend untuk memulai proses auto-login
      await axios.get('http://localhost:3001/start-login', { withCredentials: true });
      window.location.reload()
      // Simpan sessionValue ke dalam state
      
      

      // Set cookie dengan sessionValue baru

      
    } catch (error) {
      console.error('Error during auto-login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
<button
  onClick={handleLoginClick}
  disabled={loading}
  style={{
    padding: '10px 20px',
    backgroundColor: '#2E6DA4', // Warna biru Superset
    color: 'white', // Teks berwarna putih
    border: 'none', // Tanpa border
    borderRadius: '5px', // Sudut membulat
    cursor: 'pointer', // Kursor pointer saat hover
    fontSize: '16px', // Ukuran font
    margin: '10px', 
    opacity: loading ? 0.6 : 1, // Kurangi opasitas saat loading
  }}
>
  {loading ? 'Logging in...' : 'Login to Superset'}
</button>



      <h1>Dashboard Embed</h1>
      <iframe
        src="http://localhost:8088/superset/welcome"
        width="100%"
        height="800px"
        frameBorder="0"
        allowFullScreen
        title="Superset Dashboard"
      ></iframe>
    </div>
  );
};

export default AutoLoginButton;
