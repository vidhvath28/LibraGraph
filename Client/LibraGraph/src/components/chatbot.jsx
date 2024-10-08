import React, { useState } from 'react';
import { FaRobot, FaUser } from 'react-icons/fa';

const ChatBot = ({ books }) => {
  const [userInput, setUserInput] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isChatVisible, setChatVisible] = useState(false);

  const greetings = [
    "Hello! I'm Libr-AI-nian, your virtual librarian. How can I help you today?",
    "Hi there! Looking for a book? Just ask me!",
    "Welcome! What book are you interested in today?",
  ];

  const noBooksFoundResponses = [
    "Sorry, I couldn't find any books matching your query. Could you try asking something else?",
    "Hmm, no matches found. Want to ask about a different book or author?",
    "I couldn't locate any books related to that. Try asking about another title or author!",
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    const userMessage = userInput;
    setChatHistory((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setUserInput('');
    setIsTyping(true);

    // Simulate bot response delay
    setTimeout(() => {
      if (chatHistory.length === 0) {
        const greeting = greetings[Math.floor(Math.random() * greetings.length)];
        setChatHistory((prev) => [...prev, { sender: 'bot', text: greeting }]);
      } else {
        const matchingBooks = books.filter(book =>
          book.title.toLowerCase().includes(userMessage.toLowerCase()) ||
          book.author.toLowerCase().includes(userMessage.toLowerCase())
        );

        if (matchingBooks.length > 0) {
          setChatHistory((prev) => [
            ...prev,
            { sender: 'bot', text: "Here are the books I found:" },
          ]);

          matchingBooks.forEach(book => {
            setChatHistory((prev) => [
              ...prev,
              { sender: 'bot', text: `${book.title} by ${book.author}`, bookLink: book.amazonLink },
            ]);
          });

          // Follow-up question
          setChatHistory((prev) => [
            ...prev,
            { sender: 'bot', text: "Would you like to know more about another book?" },
          ]);
        } else {
          const response = noBooksFoundResponses[Math.floor(Math.random() * noBooksFoundResponses.length)];
          setChatHistory((prev) => [...prev, { sender: 'bot', text: response }]);
        }
      }
      setIsTyping(false);
    }, 1000);
  };

  const handleBookClick = (link) => {
    window.open(link, '_blank');
  };

  const toggleChat = () => {
    setChatVisible(!isChatVisible);
  };

  return (
    <>
      <button 
        onClick={toggleChat} 
        className="fixed bottom-5 right-5 bg-blue-600 text-white rounded-full p-3 shadow-lg transition-transform duration-300"
        aria-label="Toggle Chat"
      >
        💬
      </button>

      {isChatVisible && (
        <section className="fixed bottom-16 right-5 chatbot-container p-6 max-w-sm w-full shadow-lg rounded-xl bg-slate-950">
          <h2 className="text-2xl font-extrabold mb-4">Libr-AI-nian</h2>
          <div className="chat-area mb-4 h-80 overflow-y-auto rounded-lg p-4 bg-neutral-800">
            {chatHistory.map((msg, index) => (
              <div key={index} className={`mb-2 p-2 rounded-lg ${msg.sender === 'bot' ? 'bg-neutral-700' : 'bg-blue-600 text-white'} flex items-center`}>
                {msg.sender === 'bot' ? <FaRobot className="mr-2 text-blue-300" /> : <FaUser className="mr-2 text-white" />}
                <span>{msg.text}</span>
                {msg.bookLink && (
                  <button
                    onClick={() => handleBookClick(msg.bookLink)}
                    className="ml-2 px-2 py-1 bg-blue-500 hover:bg-blue-600 rounded transition-colors"
                  >
                    Buy Here
                  </button>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center mb-2 p-2 rounded-lg bg-neutral-600 text-white">
                <FaRobot className="mr-2" />
                <span>Typing...</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2">
            <input
              type="text"
              placeholder="Ask about a book..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow px-3 py-2 rounded-lg bg-neutral-700 text-base focus:outline-none focus:ring focus:ring-blue-300 transition-all"
            />
            <button type="submit" className="bg-blue-600 px-4 py-2 rounded-lg text-base hover:bg-blue-500 transition-colors">
              Send
            </button>
          </form>
        </section>
      )}
    </>
  );
};

export default ChatBot;
