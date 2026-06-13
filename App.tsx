"use client"; // Pakollinen Next.js-moninpeleissä!

import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; // Varmista, että polku osoittaa sinun firebase.js-tiedostoosi!
import { ref, set, get, child, onValue } from 'firebase/database';

export default function Home() {
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [inLobby, setInLobby] = useState(false);
  const [players, setPlayers] = useState({}); // Tila reaaliaikaisille pelaajille

  // Kuunnellaan lobbyn pelaajia reaaliajassa, kun huoneeseen on liitytty
  useEffect(() => {
    if (!roomCode) return;

    const roomRef = ref(db, `rooms/${roomCode}/players`);
    
    // Tämä funktio laukeaa aina, kun tietokannassa tapahtuu muutos
    const unsubscribe = onValue(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        setPlayers(snapshot.val());
      }
    });

    // Suljetaan kuuntelija, kun komponentti poistuu käytöstä
    return () => unsubscribe();
  }, [roomCode]);

  // Toiminto: Luodaan uusi huone tietokantaan
  const createRoom = async () => {
    if (!playerName) return alert('Syötä ensin nimesi!');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    
    try {
      await set(ref(db, 'rooms/' + code), {
        status: 'waiting',
        host: playerName,
        players: {
          [playerName]: { role: 'undecided', task: 'none' }
        }
      });
      setRoomCode(code);
      setInLobby(true);
    } catch (error) {
      alert('Virhe huoneen luomisessa: ' + error.message);
    }
  };

  // Toiminto: Liitytään olemassa olevaan huoneeseen
  const joinRoom = async () => {
    if (!playerName) return alert('Syötä ensin nimesi!');
    if (inputCode.length !== 4) return alert('Syötä 4-merkkinen koodi!');

    const dbRef = ref(db);
    try {
      const snapshot = await get(child(dbRef, `rooms/${inputCode}`));
      if (snapshot.exists()) {
        await set(ref(db, `rooms/${inputCode}/players/${playerName}`), {
          role: 'undecided',
          task: 'none'
        });
        setRoomCode(inputCode);
        setInLobby(true);
      } else {
        alert('Huonetta ei löytynyt! Tarkista koodi.');
      }
    } catch (error) {
      alert('Virhe liittyessä: ' + error.message);
    }
  };

  // NÄKYMÄ 2: Odotushuone (Lobby)
  if (inLobby) {
    return (
      <div style={{ padding: '40px', background: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: '#dc2626' }}>MURHAMYSTEERI LOBBY</h1>
        <p style={{ fontSize: '20px' }}>Olet huoneessa: <strong style={{ color: '#f59e0b' }}>{roomCode}</strong></p>
        
        <div style={{ background: '#1e293b', padding: '20px', borderRadius: '12px', maxWidth: '400px', margin: '20px auto', border: '1px solid #334155' }}>
          <h3>Paikalla olevat pelaajat:</h3>
          <ul style={{ listStyleType: 'none', padding: 0, fontSize: '18px' }}>
            {Object.keys(players).map((pName) => (
              <li key={pName} style={{ margin: '10px 0', padding: '5px', background: '#0f172a', borderRadius: '6px' }}>
                👤 {pName} {pName === playerName ? '(Sinä)' : ''}
              </li>
            ))}
          </ul>
        </div>

        <p style={{ color: '#94a3b8' }}>Odotetaan kavereita mukaan... Seuraavassa vaiheessa arvomme roolit!</p>
      </div>
    );
  }

  // NÄKYMÄ 1: Aloitusruutu
  return (
    <div style={{ padding: '40px', background: '#0f172a', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h1 style={{ color: '#dc2626', letterSpacing: '2px', marginBottom: '30px' }}>MURHAMYSTEERI MÖKILLÄ</h1>
      <div style={{ background: '#1e293b', padding: '30px', borderRadius: '12px', maxWidth: '400px', margin: '0 auto', border: '1px solid #334155' }}>
        <input 
          type="text" 
          placeholder="Kirjoita oma nimesi" 
          value={playerName} 
          onChange={(e) => setPlayerName(e.target.value)}
          style={{ padding: '10px', width: '85%', marginBottom: '20px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white', textAlign: 'center', fontSize: '16px' }}
        />
        <h3 style={{ marginBottom: '10px' }}>Luo uusi peli</h3>
        <button onClick={createRoom} style={{ background: '#dc2626', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', width: '90%', fontWeight: 'bold' }}>
          Luo uusi huone
        </button>
        <hr style={{ borderColor: '#334155', margin: '25px 0' }} />
        <h3>Liity kaverin peliin</h3>
        <input 
          type="text" 
          placeholder="4-numeroinen koodi" 
          maxLength={4} 
          value={inputCode} 
          onChange={(e) => setInputCode(e.target.value)}
          style={{ padding: '10px', width: '85%', marginBottom: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: 'white', textAlign: 'center', fontSize: '16px' }}
        />
        <button onClick={joinRoom} style={{ background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', width: '90%', fontWeight: 'bold' }}>
          Liity huoneeseen
        </button>
      </div>
    </div>
  );
}
