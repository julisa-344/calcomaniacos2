import React, { createContext, useState, ReactNode } from 'react';
import { firestore } from './firebase-config';
import { collection, getDocs, QuerySnapshot, DocumentData } from 'firebase/firestore';

type CouponContextType = {
  coupon: string | null;
  setCoupon: (coupon: string | null) => void;
  discount: number;
  setDiscount: (discount: number) => void;
};

export const CouponContext = createContext<CouponContextType>({
  coupon: null,
  setCoupon: () => {},
  discount: 0,
  setDiscount: () => {},
});

export const CouponProvider = ({ children }: { children: ReactNode }) => {
  const [coupon, setCoupon] = useState<string | null>(null);
  const [discount, setDiscount] = useState<number>(0);

  return (
    <CouponContext.Provider value={{ coupon, setCoupon, discount, setDiscount }}>
      {children}
    </CouponContext.Provider>
  );
};

export const validateCoupon = async (couponCode: string): Promise<number> => {
  const couponsCollection = collection(firestore, 'coupons');
  const snapshot: QuerySnapshot<DocumentData> = await getDocs(couponsCollection);

  for (const doc of snapshot.docs) {
    if (doc.data().code === couponCode) { // Validamos por el campo 'code'
      return doc.data().discount;
    }
  }
  return 0; // Devuelve 0 si no encuentra el cupón
};
