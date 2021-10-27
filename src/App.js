
import { useEffect, useState } from 'react';
import './App.css';
import Chat from './Chat';
import Sidebar from './Sidebar';
import Pusher from 'pusher-js'
import axios from './axios';

function App() {

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios.get('/messages/sync')
      .then((response) => {
        setMessages(response.data)
      })
  }, [])

  useEffect(() => {
    const pusher = new Pusher('6b329b6307acac453705', {
      cluster: 'ap2'
    });

    const channel = pusher.subscribe('messages');
    channel.bind("inserted", (newMessages) => {
      setMessages([...messages, newMessages])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages])

  console.log(messages)

  return (
    <div className="app">
      <div className="app_body">
        {/* sidebar */}
        <Sidebar />
      {/* chat */}
        <Chat messages={messages} />
      </div>
    </div>
  );
}

export default App;
