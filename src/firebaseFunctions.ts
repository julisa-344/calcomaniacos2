import { firestore, auth } from './firebase-config';
import { doc, getDoc, setDoc, deleteDoc, serverTimestamp, collection, getDocs } from 'firebase/firestore';

// Función para obtener los detalles de un producto por su ID
export const getProductDetails = async (productId: string) => {
  try {
    const productRef = doc(firestore, `products/${productId}`);
    const productSnapshot = await getDoc(productRef);
    if (productSnapshot.exists()) {
      return productSnapshot.data();
    } else {
      console.error(`No product found with ID: ${productId}`);
      return null;
    }
  } catch (error) {
    console.error(`Error getting product details for ID: ${productId}`, error);
    return null;
  }
};

// Otras funciones existentes
export const addToFavorites = async (productId: string) => {
  if (!productId) {
    console.error('Product ID is undefined');
    return;
  }
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const favoriteRef = doc(firestore, `users/${userId}/favorites/${productId}`);
    await setDoc(favoriteRef, {
      productId: productId,
      timestamp: serverTimestamp()
    });
  } else {
    console.log("User not authenticated");
  }
};

export const removeFromFavorites = async (productId: string) => {
  if (!productId) {
    console.error('Product ID is undefined');
    return;
  }
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const favoriteRef = doc(firestore, `users/${userId}/favorites/${productId}`);
    await deleteDoc(favoriteRef);
  } else {
    console.log("User not authenticated");
  }
};

export const getFavorites = async () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    const favoritesRef = collection(firestore, `users/${userId}/favorites`);
    const favoritesSnapshot = await getDocs(favoritesRef);
    return favoritesSnapshot.docs.map(doc => doc.data());
  } else {
    console.log("User not authenticated");
    return [];
  }
};
