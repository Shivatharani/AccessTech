import React, { createContext, useState, useContext, useEffect } from 'react';

const AssistantContext = createContext();

export const AssistantProvider = ({ children }) => {
  const [lastCommand, setLastCommand] = useState(null);
  const [activeField, setActiveField] = useState(null); // { name: 'email', value: '...' }
  const [activeTopic, setActiveTopic] = useState(null);

  const triggerCommand = (command) => {
    setLastCommand(command);
    setTimeout(() => setLastCommand(null), 1000);
  };

  const updateTopic = (topic) => {
    setActiveTopic(topic);
    setTimeout(() => setActiveTopic(null), 1000);
  };

  const updateField = (name, value) => {
    setActiveField({ name, value });
    // Reset after a short delay
    setTimeout(() => setActiveField(null), 1000);
  };

  return (
    <AssistantContext.Provider value={{ lastCommand, activeField, activeTopic, triggerCommand, updateField, updateTopic }}>
      {children}
    </AssistantContext.Provider>
  );
};

export const useAssistant = () => useContext(AssistantContext);
