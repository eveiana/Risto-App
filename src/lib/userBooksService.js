/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "./firebase";
import { OperationType, handleFirestoreError } from "./firebaseError";

const LOCAL_STORAGE_KEY = "risto_registered_books";

/**
 * Saves a registered book. Stores in Firestore if signed in, with a fallback to localStorage.
 */
export async function saveUserBook(book) {
  const currentUser = auth.currentUser;
  
  const bookToSave = {
    ...book,
    userId: currentUser ? currentUser.uid : "local-guest",
    createdAt: new Date().toISOString(),
  };

  // 1. Attempt Firestore save if user is signed in
  if (currentUser) {
    try {
      const booksCollection = collection(db, "books");
      await addDoc(booksCollection, bookToSave);
      console.log("Successfully saved chronicle to Firestore!");
    } catch (error) {
      if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
        handleFirestoreError(error, OperationType.WRITE, "books");
      }
      console.warn("Firestore save failed, falling back to localStorage:", error);
      // Fallback to storing locally as well so no data is lost
      saveToLocalStorage(bookToSave);
    }
  } else {
    // 2. Just save to localStorage for guests
    saveToLocalStorage(bookToSave);
  }
}

/**
 * Loads all registered books, combining Firestore records with local storage copies.
 */
export async function getUserBooks() {
  let firebaseBooks = [];
  const currentUser = auth.currentUser;

  if (currentUser) {
    try {
      const booksCollection = collection(db, "books");
      const q = query(booksCollection, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      querySnapshot.forEach((doc) => {
        firebaseBooks.push({
          docId: doc.id,
          ...doc.data()
        });
      });
    } catch (error) {
      if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
        handleFirestoreError(error, OperationType.LIST, "books");
      }
      console.warn("Could not load user chronicles from Firestore:", error);
    }
  }

  // Load from local storage
  const localBooks = loadFromLocalStorage();

  // Combine lists with de-duplication based on book id
  const combined = [...firebaseBooks];
  
  localBooks.forEach(localBook => {
    if (!combined.some(b => b.id === localBook.id)) {
      combined.push(localBook);
    }
  });

  return combined;
}

// Low-level localStorage helpers
function saveToLocalStorage(book) {
  try {
    const list = loadFromLocalStorage();
    list.push(book);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(list));
  } catch (e) {
    console.error("Local storage write error:", e);
  }
}

function loadFromLocalStorage() {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Local storage load error:", e);
    return [];
  }
}

/**
 * Deletes a registered book by bookId (local/state) and/or docId (Firestore).
 */
export async function deleteUserBook(bookId, docId) {
  const currentUser = auth.currentUser;

  // 1. Delete from Firestore if signed in and docId exists
  if (currentUser && docId) {
    try {
      const bookDocRef = doc(db, "books", docId);
      await deleteDoc(bookDocRef);
      console.log("Successfully deleted chronicle from Firestore!");
    } catch (error) {
      if (error?.code === "permission-denied" || error?.message?.includes("permission")) {
        handleFirestoreError(error, OperationType.DELETE, `books/${docId}`);
      }
      console.warn("Firestore delete failed, trying local backup only:", error);
    }
  }

  // 2. Always delete from localStorage to be safe and clean
  deleteFromLocalStorage(bookId);
}

function deleteFromLocalStorage(bookId) {
  try {
    const list = loadFromLocalStorage();
    const updated = list.filter((b) => b.id !== bookId);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error("Local storage delete error:", e);
  }
}

