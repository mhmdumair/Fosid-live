"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { firebaseAuth } from "@/lib/services/firebase";
import { onAuthStateChanged, getIdToken } from "firebase/auth";
import {
  setUser,
  setAccessToken,
  clearUser,
} from "@/lib/redux/features/users/user.slice";

export default function CurrentUserWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthObserver>{children}</AuthObserver>;
}

function AuthObserver({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (user) {
        // User is signed in, set the user state
        const token = await getIdToken(user);
        dispatch(setUser(user));
        dispatch(setAccessToken(token));
      } else {
        // User is signed out, clear the user state
        dispatch(clearUser());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
}
