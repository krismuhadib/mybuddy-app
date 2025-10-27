import React, { createContext, useContext, useState } from 'react';

// Créez le context
const ModalContext = createContext();

// Hook pour utiliser le context
export const useModal = () => {
  const context = useContext(ModalContext);
  
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }

  return context;
};

// Provider pour le context
export const ModalProvider = ({ children }) => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <ModalContext.Provider value={{ modalVisible, setModalVisible }}>
      {children}
    </ModalContext.Provider>
  );
};