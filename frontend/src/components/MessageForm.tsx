import React, { useState } from 'react';
import axios from 'axios';
import '../styles/MessageForm.css';

const MessageForm: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Šaljem...');

    try {
      const response = await axios.post('https://ffq4u5fyhj.execute-api.us-east-1.amazonaws.com/prod/upload', {
        name,
        message
      });
      setStatus('Poruka uspešno poslata!');
    } catch (error) {
      console.error(error);
      setStatus('Greška pri slanju.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <label>
        Ime:
        <input value={name} onChange={(e) => setName(e.target.value)} required />
      </label>

      <label>
        Poruka:
        <textarea value={message} onChange={(e) => setMessage(e.target.value)} required />
      </label>

      <button type="submit">Pošalji</button>
      <p>{status}</p>
    </form>
  );
};

export default MessageForm;
