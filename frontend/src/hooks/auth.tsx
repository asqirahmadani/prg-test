import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import useSWRMutation from "swr/mutation";

type SignInForm = { username: string; password: string };
type User = {
  id: number;
  token: string;
  role: string;
};

type UserContextType = {
  user: User | null;
  signIn: (args: SignInForm) => Promise<void>;
  signOut: () => void;
  isLoggingIn: boolean;
  loginError: any;
  isLoading: boolean;
};

const AuthDataContext = createContext<UserContextType | undefined>(undefined);

const poster = async (url: string, { arg }: { arg: any }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(arg),
  });

  if (!res.ok) {
    let errorMessage = "An unexpected error occurred. Please try again.";
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      const textError = await res.text();
      if (textError && textError.length < 100) errorMessage = textError;
    }
    throw new Error(errorMessage);
  }

  return res.json();
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const handleAuthSuccess = (token: string) => {
    const decoded: any = jwtDecode(token);
    const userData: User = {
      id: decoded.sub,
      role: decoded.role ?? "user",
      token: token,
    };
    setUser(userData);
    localStorage.setItem("jwt", token);
  };

  const {
    trigger: loginTrigger,
    isMutating: isLoggingIn,
    error: loginError,
  } = useSWRMutation(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, poster);

  const signIn = async (signInForm: SignInForm) => {
    try {
      const response = await loginTrigger(signInForm);
      if (response.data) {
        handleAuthSuccess(response.data.token);
      }
    } catch (e) {
      console.error("Login failed:", e);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.clear();
  };

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          signOut();
        } else {
          setUser({
            id: decoded.sub,
            role: decoded.role ?? "user",
            token: token,
          });
        }
      } catch (e) {
        localStorage.clear();
      }
    }
    setIsLoading(false);
  }, []);

  return (
    <AuthDataContext.Provider
      value={{
        user,
        signIn,
        signOut,
        isLoggingIn,
        loginError,
        isLoading,
      }}
    >
      {children}
    </AuthDataContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthDataContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
