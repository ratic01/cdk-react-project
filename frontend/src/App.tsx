import React from 'react';
import logo from './logo.svg';
import './App.css';
import MessageForm from './components/MessageForm';

function App() {
  return (
    <div className="App">
      <h1>Pošalji Poruku</h1>
      <MessageForm />
    </div>
  );
}

export default App;
