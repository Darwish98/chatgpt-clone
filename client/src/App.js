import './App.css';
import './normal.css';
import { useState,useRef,useEffect } from 'react';


function App() {

  const [input, setInput] = useState("");
  const [temperature, setTemperature] = useState(0.4);
  const [tokens, setTokens] = useState(150);
  const [models, setModels] = useState([]);
  const [currentModel, setCurrentModel] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const chatLogRef = useRef(null);


  function clearChat() {
    setChatLog([]);
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  function getModels(){
    console.log("Getting models");
    fetch("http://localhost:3080/models")
    .then((res) => res.json())
    .then((data) => {
      const filteredModels = data.models.data.filter(model =>
        model.id.startsWith("gpt-")
      );
      setModels(filteredModels);
      console.log(filteredModels);
    });
  }


  async function handleSubmit(e) {
    e.preventDefault();
    let chatLogNew = [...chatLog, {user: "me", message: `${input}`}];
    setInput("");
    setChatLog(chatLogNew);
    const messages= chatLogNew.map((message) => message.message).join("\n");
    const response = await fetch("http://localhost:3080/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: messages,
        model: currentModel,
        temperature: temperature,
        tokens: tokens
       })
   });
    const data = await response.json();
    setChatLog([...chatLogNew, {user: "gpt", message: `${data.message}`}]);
  }

  useEffect(() => {
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [chatLog]);

  useEffect(() => {
    getModels();
  },[]);

  return (
    <div className="App">
      <button className="menu-toggle-button" onClick={toggleMenu}>
        
      </button>
      <aside className={`sidemenu ${isMenuOpen ? 'open' : 'closed'}`}>
        <div className="side-menu-button" onClick={clearChat}>
          <span>+</span>
          New Chat
        </div>
        <div className='models'>
          <select onChange={(e) => {
            setCurrentModel(e.target.value);
            }}>
            {models.map((model, index) => (
              <option key={index} value={model.id}>
                {model.id}
              </option>
            ))}
          </select>
        </div>
       
        <div className="slider-container">
          <label htmlFor="slider">Adjust Temperature:</label>
          <input
            type="range"
            id="slider"
            min="0"
            max="1"
            step="0.05"
            value={temperature}
            onChange={(e) => setTemperature(e.target.value)}
          />
          <span>{temperature}</span>
        </div>

        <div className="slider-container">
          <label htmlFor="slider">Adjust Tokens:</label>
          <input
            type="range"
            id="slider"
            min="10"
            max="300"
            step="10"
            value={tokens}
            onChange={(e) => setTokens(e.target.value)}
          />
          <span>{tokens}</span>
        </div>


      </aside>
      <section className="chatbox">
        <div className="chat-log" ref={chatLogRef}>
          {chatLog.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
        </div>
        <div className="chat-input-holder">
          <form onSubmit={handleSubmit}>
            <input
            rows="1" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="chat-input-textarea"
            placeholder="Message ChatGPT">
            </input>
          </form>
        </div>

      </section>
    </div>
  );
}


const ChatMessage = ({message, user}) => {
  return(
    <div className={`chat-message ${message.user === "gpt" && "chatgpt"}`}>
            <div className="chat-message-center">
              <div className={`avatar ${message.user === "gpt" && "chatgpt"}`}>
               
               </div>
              <div className="message">
               {message.message}
            
              </div>
            </div>

          </div>
  )
}
export default App;
