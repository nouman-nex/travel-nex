import { createContext, useContext, useState } from "react";

const CheckoutContext = createContext();

export const useCheckout = () => useContext(CheckoutContext);

export const CheckoutProvider = ({ children }) => {
  const [product, setProduct] = useState(null); // only one product

  return (
    <CheckoutContext.Provider value={{ product, setProduct }}>
      {children}
    </CheckoutContext.Provider>
  );
};
