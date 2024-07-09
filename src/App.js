import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

const App = () => {
  const [client, setClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    // Conectar al broker MQTT
    const client = mqtt.connect('ws://38.43.134.172:1884');

    client.on('connect', () => {
      console.log('Conectado a MQTT Broker');
      setIsConnected(true);
      // Suscribirse a un tópico
      client.subscribe('prueba', (err) => {
        if (!err) {
          console.log('Suscrito al tópico');
        }
      });
    });

    client.on('message', (topic, message) => {
      // Manejar mensajes recibidos
      console.log(`Mensaje recibido: ${message.toString()}`);
      setMessages((prevMessages) => [...prevMessages, message.toString()]);
    });

    setClient(client);

    // Limpiar la conexión al desmontar el componente
    return () => {
      client.end();
    };
  }, []);

  const sendMessage = (message) => {
    if (client && isConnected) {
      client.publish('tu/topico', message);
      console.log(`Mensaje enviado: ${message}`);
    }
  };

  return (
    <div>
      <h1>React MQTT Demo</h1>
      <div>
        <input
          type="text"
          placeholder="Escribe un mensaje"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
        />
      </div>
      <div>
        <h2>Mensajes recibidos:</h2>
        <ul>
          {messages.map((msg, index) => (
            <li key={index}>{msg}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
