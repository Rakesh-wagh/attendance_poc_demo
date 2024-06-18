import { auth, db } from "./firebaseConfig";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { set, push, ref, onValue, update } from "firebase/database";

export const doCreateUserWithEmailAndPassword = async (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const doSignInWithEmailAndPassword = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const doSignInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const isNewUser = result?._tokenResponse?.isNewUser;
    let userDetails = {
      userId: user?.uid,
      name: user?.displayName,
      email: user?.email,
      photoURL: user?.photoURL,
      phoneNumber: user?.phoneNumber,
    };

    if (isNewUser) {
      userDetails = {
        ...userDetails,
        createdAt: new Date().toISOString(),
      };
      await writeData(userDetails);
    }

    return user.uid;
  } catch (error) {
    console.error(error);
    throw new Error("Failed to sign in with Google");
  }
};

export const writeData = async (userDetails) => {
  const newDoc = push(ref(db, "Employee"));
  set(newDoc, userDetails)
    .then(() => {
      console.log("Data written successfully");
    })
    .catch((error) => {
      console.error("Error writing document: ", error);
    });
};

export const doSignOut = () => {
  return auth.signOut();
};

export const fetchEmployees = (setEmployees) => {
  const employeesRef = ref(db, "Employee");
  onValue(employeesRef, (snapshot) => {
    const data = snapshot.val();
    const employeesList = data
      ? Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }))
      : [];
    setEmployees(employeesList);
  });
};

export const fetchUserById = async (userId) => {
  const userRef = ref(db, `Employee/${userId}`);

  return new Promise((resolve, reject) => {
    onValue(
      userRef,
      (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          resolve(userData);
        } else {
          resolve(null);
        }
      },
      (error) => {
        reject(error);
      }
    );
  });
};

export const updateUserById = async (userId, userData) => {
  const userRef = ref(db, `Employee/${userId}`);

  return update(userRef, userData)
    .then(() => {
      console.log("User data updated successfully");
    })
    .catch((error) => {
      console.error("Error updating user data:", error);
    });
};
