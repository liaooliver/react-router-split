import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, Meta, Links, Outlet, ScrollRestoration, Scripts, useNavigate, NavLink, Link } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createElement, createContext, useContext, useState, useEffect, useMemo } from "react";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, signOut, signInWithPopup, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import axios$1 from "axios";
import { XIcon, CalendarIcon, Plus, ArrowLeft, Pencil, Trash2, AlertTriangle, X, CircleIcon, ChevronDownIcon, CheckIcon, ChevronUpIcon, User, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, Controller, useFormContext, useFormState, useForm } from "react-hook-form";
import * as z from "zod";
import * as SwitchPrimitive from "@radix-ui/react-switch";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
const firebaseConfig = {
  apiKey: "AIzaSyDawfeTKwk1tKAkD1DJ5nN5ijvTSHfciCo",
  authDomain: "react-router-split.firebaseapp.com",
  projectId: "react-router-split",
  storageBucket: "react-router-split.firebasestorage.app",
  messagingSenderId: "251980448602",
  appId: "1:251980448602:web:4a3598ff42c0ddb834e963"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const firebase = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  auth,
  createUserWithEmailAndPassword,
  googleProvider
}, Symbol.toStringTag, { value: "Module" }));
const AuthContext = createContext(null);
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  async function signInWithGoogle() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in error:", error);
      throw error;
    }
  }
  function logOut() {
    return signOut(auth);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);
  const value = {
    currentUser,
    getIdToken: () => currentUser == null ? void 0 : currentUser.getIdToken(true),
    loading,
    signInWithGoogle,
    logOut
  };
  return /* @__PURE__ */ jsx(AuthContext.Provider, { value, children: !loading && children });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [/* @__PURE__ */ jsx(AuthProvider, {
        children: /* @__PURE__ */ jsx(Outlet, {})
      }), /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: root
}, Symbol.toStringTag, { value: "Module" }));
const appDesignTokens = {
  primary: "#FF5733",
  secondary: "#00C4CC",
  accent: "#FFC107"
};
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
function Avatar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Root,
    {
      "data-slot": "avatar",
      className: cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      ),
      ...props
    }
  );
}
function AvatarImage({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Image,
    {
      "data-slot": "avatar-image",
      className: cn("aspect-square size-full", className),
      ...props
    }
  );
}
function AvatarFallback({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AvatarPrimitive.Fallback,
    {
      "data-slot": "avatar-fallback",
      className: cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      ),
      ...props
    }
  );
}
const CoinIcon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx(
        "circle",
        {
          cx: "12",
          cy: "12",
          r: "9",
          fill: "#FFC107",
          stroke: "#000000",
          strokeWidth: "1",
          className: "animate-coin"
        }
      ),
      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4", fill: "#FFFFFF", opacity: "0.8" })
    ]
  }
);
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive: "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline"
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
);
function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}) {
  const Comp = asChild ? Slot : "button";
  return /* @__PURE__ */ jsx(
    Comp,
    {
      "data-slot": "button",
      className: cn(buttonVariants({ variant, size, className })),
      ...props
    }
  );
}
const Navbar = ({ iconType = "coin" }) => {
  const { currentUser, logOut } = useAuth();
  const navigate = useNavigate();
  const handleGoogleLogOut = async () => {
    try {
      await logOut();
      navigate("/login");
    } catch (error) {
      console.error("Google log out error:", error);
    }
  };
  return /* @__PURE__ */ jsx("nav", { className: "p-4 sticky top-0 z-20 bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center", children: [
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxs(
      NavLink,
      {
        to: "/",
        className: "flex items-center px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
        children: [
          /* @__PURE__ */ jsx(CoinIcon, {}),
          /* @__PURE__ */ jsx("h1", { className: "text-xl", children: "活潑分帳" })
        ]
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-4", children: [
      currentUser && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("p", { children: [
          "Hi, ",
          currentUser.displayName || "使用者",
          "!"
        ] }),
        /* @__PURE__ */ jsxs(Avatar, { className: "w-10 h-10 border-2 border-white", children: [
          /* @__PURE__ */ jsx(
            AvatarImage,
            {
              src: currentUser.photoURL || void 0,
              alt: currentUser.displayName || "使用者頭像"
            }
          ),
          /* @__PURE__ */ jsx(AvatarFallback, { className: "bg-accent", children: currentUser.displayName ? currentUser.displayName[0].toUpperCase() : "U" })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        Button,
        {
          className: "px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
          onClick: handleGoogleLogOut,
          children: "登出"
        }
      )
    ] })
  ] }) });
};
const GradientBackground = () => /* @__PURE__ */ jsxs("div", {
  className: "absolute top-0 left-0 w-full h-full z-0",
  children: [/* @__PURE__ */ jsx("div", {
    className: "w-full h-full bg-gradient-custom"
  }), /* @__PURE__ */ jsxs("svg", {
    className: "absolute top-0 left-0 w-full h-full opacity-30",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "xMidYMid slice",
    children: [/* @__PURE__ */ jsxs("radialGradient", {
      id: "galaxy-core",
      cx: "50%",
      cy: "50%",
      r: "50%",
      children: [/* @__PURE__ */ jsx("stop", {
        offset: "0%",
        stopColor: appDesignTokens.primary,
        stopOpacity: "0.5"
      }), /* @__PURE__ */ jsx("stop", {
        offset: "60%",
        stopColor: appDesignTokens.accent,
        stopOpacity: "0.2"
      }), /* @__PURE__ */ jsx("stop", {
        offset: "100%",
        stopColor: appDesignTokens.secondary,
        stopOpacity: "0"
      })]
    }), /* @__PURE__ */ jsx("ellipse", {
      cx: "50",
      cy: "50",
      rx: "18",
      ry: "10",
      fill: "url(#galaxy-core)"
    }), /* @__PURE__ */ jsx("circle", {
      cx: "50",
      cy: "50",
      r: "2.5",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsxs("g", {
      opacity: "0.5",
      children: [/* @__PURE__ */ jsx("path", {
        d: "M50,50 Q70,40 90,60",
        stroke: appDesignTokens.accent,
        strokeWidth: "1.2",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M50,50 Q30,60 10,40",
        stroke: appDesignTokens.secondary,
        strokeWidth: "1.2",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M50,50 Q80,20 95,35",
        stroke: appDesignTokens.primary,
        strokeWidth: "0.7",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M50,50 Q20,20 5,65",
        stroke: appDesignTokens.accent,
        strokeWidth: "0.7",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M50,50 Q80,80 95,65",
        stroke: appDesignTokens.secondary,
        strokeWidth: "0.6",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M50,50 Q20,80 5,35",
        stroke: appDesignTokens.primary,
        strokeWidth: "0.6",
        fill: "none"
      })]
    }), /* @__PURE__ */ jsxs("g", {
      children: [/* @__PURE__ */ jsx("circle", {
        cx: "20",
        cy: "30",
        r: "0.7",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "80",
        cy: "20",
        r: "0.5",
        fill: appDesignTokens.secondary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "15",
        cy: "80",
        r: "0.3",
        fill: appDesignTokens.accent
      }), /* @__PURE__ */ jsx("circle", {
        cx: "60",
        cy: "10",
        r: "0.6",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "85",
        cy: "85",
        r: "0.4",
        fill: appDesignTokens.secondary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "40",
        cy: "65",
        r: "0.5",
        fill: appDesignTokens.accent
      }), /* @__PURE__ */ jsx("circle", {
        cx: "70",
        cy: "70",
        r: "0.8",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "55",
        cy: "80",
        r: "0.3",
        fill: appDesignTokens.secondary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "25",
        cy: "55",
        r: "0.4",
        fill: appDesignTokens.accent
      }), /* @__PURE__ */ jsx("circle", {
        cx: "75",
        cy: "45",
        r: "0.5",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "30",
        cy: "20",
        r: "0.3",
        fill: appDesignTokens.secondary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "68",
        cy: "35",
        r: "0.4",
        fill: appDesignTokens.accent
      }), /* @__PURE__ */ jsx("circle", {
        cx: "45",
        cy: "25",
        r: "0.2",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "60",
        cy: "75",
        r: "0.3",
        fill: appDesignTokens.secondary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "90",
        cy: "55",
        r: "0.4",
        fill: appDesignTokens.accent
      }), /* @__PURE__ */ jsx("circle", {
        cx: "10",
        cy: "45",
        r: "0.2",
        fill: appDesignTokens.primary
      }), /* @__PURE__ */ jsx("circle", {
        cx: "50",
        cy: "15",
        r: "0.3",
        fill: appDesignTokens.accent
      })]
    }), /* @__PURE__ */ jsx("ellipse", {
      cx: "70",
      cy: "30",
      rx: "6",
      ry: "2.5",
      fill: appDesignTokens.accent,
      opacity: "0.09"
    }), /* @__PURE__ */ jsx("ellipse", {
      cx: "30",
      cy: "70",
      rx: "7",
      ry: "3",
      fill: appDesignTokens.secondary,
      opacity: "0.07"
    }), /* @__PURE__ */ jsx("ellipse", {
      cx: "80",
      cy: "80",
      rx: "10",
      ry: "4",
      fill: appDesignTokens.primary,
      opacity: "0.05"
    })]
  })]
});
const Layout = () => {
  const {
    currentUser
  } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!currentUser) {
      navigate("/login");
    }
  }, []);
  return /* @__PURE__ */ jsxs("div", {
    className: "min-h-screen font-sans relative overflow-hidden",
    children: [/* @__PURE__ */ jsx(GradientBackground, {}), /* @__PURE__ */ jsx(Navbar, {
      iconType: "coin"
    }), /* @__PURE__ */ jsx("main", {
      className: "w-full max-w-mobile md:max-w-tablet lg:max-w-desktop mx-auto p-4 z-10 relative",
      children: /* @__PURE__ */ jsx(Outlet, {})
    })]
  });
};
const Layout$1 = withComponentProps(Layout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Layout$1
}, Symbol.toStringTag, { value: "Module" }));
const getApiBaseUrl = () => {
  const env = "production";
  console.log(process.env.NODE_ENV, process.env.VITE_NODE_ENV);
  console.log("https://split-backend.zeabur.app/api");
  switch (env) {
    case "production":
      return "https://split-backend.zeabur.app/api";
    default:
      return "http://localhost:3000/api";
  }
};
const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 1e4,
  // 10 seconds
  headers: {
    "Content-Type": "application/json"
  }
};
console.log(API_CONFIG);
const axiosInstance = axios$1.create(API_CONFIG);
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    var _a;
    if (((_a = error.response) == null ? void 0 : _a.status) === 401) {
      console.error("未授權的請求");
    }
    return Promise.reject(error);
  }
);
const axios = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: axiosInstance
}, Symbol.toStringTag, { value: "Module" }));
async function fetchProtectedCreateEvent(name) {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.post(
      "/events",
      {
        name
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error("新增事件失敗");
  }
}
async function fetchProtectedDashboardData() {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.get(
      "/dashboard",
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw error.response.data;
    }
    throw new Error("無法取得儀表板資料");
  }
}
async function fetchEmailExists(email) {
  var _a, _b, _c;
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.post(
      "/users/email-exists",
      {
        email
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios$1.isAxiosError(error)) {
      throw new Error(
        ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error) || `HTTP error! status: ${(_c = error.response) == null ? void 0 : _c.status}`
      );
    }
    throw error;
  }
}
async function fetchProtectedFindOrCreateUser({
  email,
  displayName,
  uid,
  idToken
}) {
  var _a, _b, _c;
  try {
    const response = await axiosInstance.post(
      "/users/find-or-create",
      { email, displayName, uid },
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios$1.isAxiosError(error)) {
      throw new Error(
        ((_b = (_a = error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.error) || `HTTP error! status: ${(_c = error.response) == null ? void 0 : _c.status}`
      );
    }
    throw error;
  }
}
async function fetchProtectedData() {
  var _a, _b, _c, _d;
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }
  try {
    const idToken = await user.getIdToken(true);
    const response = await axiosInstance.post(
      `/users/google/find-or-create`,
      {},
      // empty body
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    if (response.status === 204) return null;
    return response.data;
  } catch (error) {
    if (axios$1.isAxiosError(error)) {
      console.error(
        `API call to /login/google failed:`,
        ((_a = error.response) == null ? void 0 : _a.data) || error.message
      );
      throw new Error(
        ((_c = (_b = error.response) == null ? void 0 : _b.data) == null ? void 0 : _c.error) || `HTTP error! status: ${(_d = error.response) == null ? void 0 : _d.status}`
      );
    }
    throw error;
  }
}
function Card({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card",
      className: cn(
        "bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
        className
      ),
      ...props
    }
  );
}
function CardHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-header",
      className: cn(
        "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
        className
      ),
      ...props
    }
  );
}
function CardTitle({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-title",
      className: cn("leading-none font-semibold", className),
      ...props
    }
  );
}
function CardDescription({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function CardContent({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-content",
      className: cn("px-6", className),
      ...props
    }
  );
}
function CardFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "card-footer",
      className: cn("flex items-center px-6 [.border-t]:pt-6", className),
      ...props
    }
  );
}
function Dialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Root, { "data-slot": "dialog", ...props });
}
function DialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Trigger, { "data-slot": "dialog-trigger", ...props });
}
function DialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(DialogPrimitive.Portal, { "data-slot": "dialog-portal", ...props });
}
function DialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Overlay,
    {
      "data-slot": "dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function DialogContent({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
    /* @__PURE__ */ jsx(DialogOverlay, {}),
    /* @__PURE__ */ jsxs(
      DialogPrimitive.Content,
      {
        "data-slot": "dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxs(DialogPrimitive.Close, { className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4", children: [
            /* @__PURE__ */ jsx(XIcon, {}),
            /* @__PURE__ */ jsx("span", { className: "sr-only", children: "Close" })
          ] })
        ]
      }
    )
  ] });
}
function DialogHeader({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function DialogFooter({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function DialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Title,
    {
      "data-slot": "dialog-title",
      className: cn("text-lg leading-none font-semibold", className),
      ...props
    }
  );
}
function DialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    DialogPrimitive.Description,
    {
      "data-slot": "dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
const DebtOverview = ({ debts, onPaidSuccess }) => {
  var _a, _b, _c;
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    debtId: null
  });
  useEffect(() => {
    console.log(debts);
  });
  const handleMarkPaid = (id) => {
    setConfirmDialog({ isOpen: true, debtId: id });
  };
  const handleConfirmPayment = async () => {
    if (!confirmDialog.debtId) {
      setConfirmDialog({ isOpen: false, debtId: null });
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      await axiosInstance.post(
        `/settlement/debts/${confirmDialog.debtId}/mark-paid`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`
          }
        }
      );
      if (onPaidSuccess) onPaidSuccess();
    } catch (err) {
      alert("標記失敗，請稍後再試。");
    }
    setConfirmDialog({ isOpen: false, debtId: null });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-md font-medium text-[#263238] mb-3", children: "分帳關係" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 max-h-[500px] overflow-auto", children: /* @__PURE__ */ jsx(AnimatePresence, { children: debts.length > 0 ? debts.map((d) => /* @__PURE__ */ jsx(
        motion.div,
        {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0, transition: { duration: 0.3 } },
          className: "bg-white border border-gray-300 rounded-md p-3 flex flex-col items-center justify-between",
          children: /* @__PURE__ */ jsxs("div", { className: "flex flex-col w-full gap-4", children: [
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 mr-2" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#263238]", children: d.fromUserName })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsx("span", { className: "text-gray-400", children: "➜" }),
                /* @__PURE__ */ jsxs("span", { className: "text-sm text-[#EF4444] font-medium", children: [
                  "$",
                  d.amount
                ] })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsx("div", { className: "w-8 h-8 rounded-full bg-gray-200 mr-2" }),
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#263238]", children: d.toUserName })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsx("span", { className: "text-xs text-gray-400" }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-[72px] h-[28px] text-xs bg-[#00C4CC] text-white rounded",
                  onClick: () => handleMarkPaid(d.id),
                  disabled: d.paid,
                  children: d.paid ? "已還款" : "標記已付"
                }
              )
            ] })
          ] })
        },
        d.id
      )) : /* @__PURE__ */ jsx("p", { className: "text-sm text-[#9CA3AF] text-center", children: "目前無未還款債務" }) }) })
    ] }),
    /* @__PURE__ */ jsx(
      Dialog,
      {
        open: confirmDialog.isOpen,
        onOpenChange: (isOpen) => setConfirmDialog({ isOpen, debtId: null }),
        children: /* @__PURE__ */ jsxs(DialogContent, { className: "sm:max-w-[425px] bg-white border border-gray-300 rounded-md p-4 text-black", children: [
          /* @__PURE__ */ jsxs(DialogHeader, { children: [
            /* @__PURE__ */ jsx(DialogTitle, { children: "確認標記已還款" }),
            /* @__PURE__ */ jsx(DialogDescription, { children: confirmDialog.debtId && debts.find((d) => d.id === confirmDialog.debtId) && /* @__PURE__ */ jsxs(Fragment, { children: [
              "確定要標記這筆債務為已還款嗎？",
              /* @__PURE__ */ jsxs("div", { className: "mt-2 p-3 bg-gray-50 rounded-md", children: [
                /* @__PURE__ */ jsxs("p", { children: [
                  "付款人：",
                  (_a = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _a.fromUserName
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "收款人：",
                  (_b = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _b.toUserName
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "金額：$",
                  (_c = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _c.amount
                ] })
              ] })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxs(DialogFooter, { className: "sm:justify-start", children: [
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                variant: "secondary",
                onClick: () => setConfirmDialog({ isOpen: false, debtId: null }),
                className: "w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90",
                children: "取消"
              }
            ),
            /* @__PURE__ */ jsx(
              Button,
              {
                type: "button",
                onClick: handleConfirmPayment,
                className: "bg-[#00C4CC] hover:bg-[#00A3A9]",
                children: "確認已還款"
              }
            )
          ] })
        ] })
      }
    )
  ] });
};
const EventList = ({ events }) => {
  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return {
          label: "進行中",
          desc: "未結算",
          bgColor: "bg-blue-100 text-blue-800"
        };
      case "pending":
        return {
          label: "待還款",
          desc: "部分還款",
          bgColor: "bg-yellow-100 text-yellow-800"
        };
      case "settled":
        return {
          label: "已結算",
          desc: "已結算",
          bgColor: "bg-green-100 text-green-800"
        };
      case "finalized":
        return {
          label: "已完成",
          desc: "已完成",
          bgColor: "bg-gray-900 text-gray-100"
        };
      default:
        return {
          label: "未知",
          desc: "未知狀態",
          bgColor: "bg-gray-100 text-gray-800"
        };
    }
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-md font-medium text-[#263238] mb-4", children: "所有事件" }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 gap-4 max-h-[500px] overflow-auto", children: events.map((event) => {
      const statusInfo = getStatusInfo(event.status);
      return /* @__PURE__ */ jsx(Link, { to: `/events/${event.id}`, className: "block", children: /* @__PURE__ */ jsxs(Card, { className: "py-3 gap-3 border border-gray-200 hover:border-[#0066CC]", children: [
        /* @__PURE__ */ jsxs(CardHeader, { children: [
          /* @__PURE__ */ jsx(CardTitle, { className: "text-lg font-semibold", children: event.name }),
          /* @__PURE__ */ jsxs(CardDescription, { className: "flex items-center", children: [
            /* @__PURE__ */ jsx(CalendarIcon, { className: "h-4 w-4 mr-1" }),
            event.date
          ] })
        ] }),
        /* @__PURE__ */ jsxs(CardContent, { children: [
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600", children: [
            event.members.length,
            " 位成員 • ",
            event.expenses.length,
            " ",
            "筆費用"
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 mt-1", children: [
            "累積費用：",
            /* @__PURE__ */ jsxs(
              "span",
              {
                className: event.balance >= 0 ? "text-[#10B981]" : "text-[#EF4444]",
                children: [
                  "$",
                  event.balance
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(CardFooter, { children: /* @__PURE__ */ jsx("div", { className: "w-full flex items-center", children: /* @__PURE__ */ jsx(
          "span",
          {
            className: `text-sm font-medium px-2 py-0.5 rounded-full ${statusInfo.bgColor}`,
            children: statusInfo.label
          }
        ) }) })
      ] }) }, event.id);
    }) })
  ] });
};
function meta$1({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const PersonalDashboard = () => {
  const {
    currentUser,
    logOut
  } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedDashboardData();
        console.log(data);
        setDashboardData(data.data);
      } catch (err) {
        logOut();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    const getToken = async () => {
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        console.log(token);
        localStorage.setItem("token", JSON.stringify(token));
      }
    };
    getToken();
  }, [currentUser]);
  if (loading) {
    return /* @__PURE__ */ jsx("div", {
      className: "text-center mt-8",
      children: "載入中..."
    });
  }
  if (error) {
    return /* @__PURE__ */ jsx("div", {
      className: "text-center mt-8 text-red-500",
      children: error
    });
  }
  if (!dashboardData) {
    return /* @__PURE__ */ jsx("div", {
      className: "text-center mt-8",
      children: "沒有資料"
    });
  }
  const {
    events,
    unpaidDebtsTotal,
    balanceTotal,
    user,
    debtOverview
  } = dashboardData;
  const debts = (debtOverview == null ? void 0 : debtOverview.debts) || [];
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-md mx-auto p-4 space-y-6",
    children: [/* @__PURE__ */ jsx("header", {
      className: "text-center text-[24px] font-semibold text-[#263238] py-4",
      children: "我的帳本"
    }), /* @__PURE__ */ jsx("div", {
      className: "flex justify-evenly text-center bg-white p-4 border rounded-xl",
      children: /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-[#71717A]",
          children: "待收欠款"
        }), /* @__PURE__ */ jsxs("p", {
          className: "text-[20px] font-semibold text-[#EF4444]",
          children: ["$", unpaidDebtsTotal]
        })]
      })
    }), /* @__PURE__ */ jsx(EventList, {
      events
    }), /* @__PURE__ */ jsx(DebtOverview, {
      debts
    }), /* @__PURE__ */ jsx(Link, {
      to: "/createEvent",
      children: /* @__PURE__ */ jsx(Button, {
        className: "fixed bottom-8 right-8 bg-[#FF5733] text-white rounded-full w-12 h-12 p-0",
        children: /* @__PURE__ */ jsx(Plus, {
          className: "w-5 h-5"
        })
      })
    })]
  });
};
const personalDashboard = withComponentProps(PersonalDashboard);
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: personalDashboard,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      ),
      ...props
    }
  );
}
const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newEvent = await fetchProtectedCreateEvent(eventName);
      navigate(`/events/${newEvent.event.id}`);
    } catch (error) {
      console.error("建立事件失敗:", error);
      alert("建立事件失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-md mx-auto p-4 space-y-6",
    children: [/* @__PURE__ */ jsxs("header", {
      className: "flex items-center justify-between h-16 px-4 relative m-0",
      children: [/* @__PURE__ */ jsxs(Link, {
        to: "/",
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsx(ArrowLeft, {
          className: "w-5 h-5 text-gray-700"
        }), /* @__PURE__ */ jsx("h1", {
          className: "text-lg font-semibold text-gray-800",
          children: "建立分帳事件"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute right-12 top-6",
        children: /* @__PURE__ */ jsx("div", {
          className: "h-1 w-4 bg-orange-400 rounded-full transform rotate-45"
        })
      }), /* @__PURE__ */ jsx("div", {
        className: "absolute right-8 top-8",
        children: /* @__PURE__ */ jsx("div", {
          className: "h-2 w-2 bg-orange-300 rounded-full"
        })
      })]
    }), /* @__PURE__ */ jsx("main", {
      className: "flex-1 px-8",
      children: /* @__PURE__ */ jsxs("form", {
        onSubmit: handleSubmit,
        className: "space-y-6",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "space-y-2",
          children: [/* @__PURE__ */ jsx("label", {
            htmlFor: "eventName",
            className: "block text-sm font-medium text-gray-500",
            children: "事件名稱"
          }), /* @__PURE__ */ jsx(Input, {
            id: "eventName",
            type: "text",
            placeholder: "請輸入事件名稱",
            value: eventName,
            onChange: (e) => setEventName(e.target.value),
            required: true,
            disabled: isLoading,
            className: "text-black"
          })]
        }), /* @__PURE__ */ jsx(Button, {
          type: "submit",
          className: "w-full bg-primary text-primary-foreground hover:bg-primary/90",
          disabled: isLoading,
          children: isLoading ? "建立中..." : "儲存"
        })]
      })
    })]
  });
};
const createEvent = withComponentProps(CreateEvent);
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: createEvent
}, Symbol.toStringTag, { value: "Module" }));
async function fetchProtectedEventDetail(eventId) {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.get(
      `/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data;
  } catch (error) {
    if (axios$1.isAxiosError(error) && error.response) {
      throw error.response.data;
    }
    throw new Error("取得事件詳情失敗");
  }
}
const PageHeader = ({ title, path }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (path) {
      navigate(path);
    } else {
      navigate(-1);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      onClick: handleBack,
      className: "flex items-center gap-4 cursor-pointer",
      children: [
        /* @__PURE__ */ jsx(ArrowLeft, { className: "w-5 h-5 text-gray-700" }),
        /* @__PURE__ */ jsx("h1", { className: "text-lg font-semibold text-gray-800", children: title })
      ]
    }
  );
};
const AnimatedPageContainer = ({
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsx(
    motion.div,
    {
      className: `max-w-md mx-auto p-4 space-y-4 ${className}`,
      initial: { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.3 },
      children
    }
  );
};
function AlertDialog({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Root, { "data-slot": "alert-dialog", ...props });
}
function AlertDialogTrigger({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Trigger, { "data-slot": "alert-dialog-trigger", ...props });
}
function AlertDialogPortal({
  ...props
}) {
  return /* @__PURE__ */ jsx(AlertDialogPrimitive.Portal, { "data-slot": "alert-dialog-portal", ...props });
}
function AlertDialogOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Overlay,
    {
      "data-slot": "alert-dialog-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function AlertDialogContent({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxs(AlertDialogPortal, { children: [
    /* @__PURE__ */ jsx(AlertDialogOverlay, {}),
    /* @__PURE__ */ jsx(
      AlertDialogPrimitive.Content,
      {
        "data-slot": "alert-dialog-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
          className
        ),
        ...props
      }
    )
  ] });
}
function AlertDialogHeader({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-header",
      className: cn("flex flex-col gap-2 text-center sm:text-left", className),
      ...props
    }
  );
}
function AlertDialogFooter({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "alert-dialog-footer",
      className: cn(
        "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
        className
      ),
      ...props
    }
  );
}
function AlertDialogTitle({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Title,
    {
      "data-slot": "alert-dialog-title",
      className: cn("text-lg font-semibold", className),
      ...props
    }
  );
}
function AlertDialogDescription({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Description,
    {
      "data-slot": "alert-dialog-description",
      className: cn("text-muted-foreground text-sm", className),
      ...props
    }
  );
}
function AlertDialogAction({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Action,
    {
      className: cn(buttonVariants(), className),
      ...props
    }
  );
}
function AlertDialogCancel({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    AlertDialogPrimitive.Cancel,
    {
      className: cn(buttonVariants({ variant: "outline" }), className),
      ...props
    }
  );
}
const dountColor = [
  "#0066CC",
  "#FFC107",
  "#2196F3",
  "#FF9800",
  "#4caf50",
  "#e91e63"
];
const DonutChart = ({ data, totalAmount }) => {
  let startAngle = 0;
  const pathData = data.map((item, index) => {
    const percentage = item.amount / totalAmount * 100;
    const angle = percentage / 100 * 360;
    const endAngle = startAngle + angle;
    const startRad = (startAngle - 90) * Math.PI / 180;
    const endRad = (endAngle - 90) * Math.PI / 180;
    const x1 = 40 + 30 * Math.cos(startRad);
    const y1 = 40 + 30 * Math.sin(startRad);
    const x2 = 40 + 30 * Math.cos(endRad);
    const y2 = 40 + 30 * Math.sin(endRad);
    const largeArcFlag = angle > 180 ? 1 : 0;
    const pathString = `M 40 40 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;
    startAngle = endAngle;
    return /* @__PURE__ */ jsx(
      "path",
      {
        d: pathString,
        fill: dountColor[index],
        stroke: "#fff",
        strokeWidth: "1",
        className: "transition-all duration-300 hover:opacity-80"
      },
      index
    );
  });
  return /* @__PURE__ */ jsxs("div", { className: "relative", children: [
    /* @__PURE__ */ jsxs("svg", { viewBox: "0 0 80 80", width: "120", height: "120", className: "mx-auto", children: [
      pathData,
      /* @__PURE__ */ jsx("circle", { cx: "40", cy: "40", r: "15", fill: "#fff" }),
      /* @__PURE__ */ jsxs(
        "text",
        {
          x: "40",
          y: "44",
          textAnchor: "middle",
          fontSize: "8",
          fontWeight: "bold",
          fill: "#263238",
          children: [
            "$",
            totalAmount
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsx("div", { className: "absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center", children: /* @__PURE__ */ jsx("span", { className: "text-white font-bold text-xs", children: "$" }) })
  ] });
};
const LoadingSpinner = ({ text }) => /* @__PURE__ */ jsxs("div", { className: "flex flex-col items-center justify-center min-h-[60vh]", children: [
  /* @__PURE__ */ jsx("div", { className: "animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-[#00C4CC] mb-4" }),
  /* @__PURE__ */ jsx("div", { className: "text-lg text-[#263238] font-medium", children: text || "載入中..." })
] });
function isDuplicateMemberName(name, members) {
  return members.some(
    (member) => member.name.toLowerCase() === name.toLowerCase()
  );
}
async function addEventMember({
  event_id,
  user_id
}) {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  const res = await axiosInstance.post(
    "users/event-members/add",
    { event_id, user_id },
    {
      headers: {
        Authorization: `Bearer ${idToken}`
      }
    }
  );
  return res.data;
}
async function fetchEventMembers(eventId) {
  if (!eventId) throw new Error("eventId is required");
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  const res = await axiosInstance.get(`/users/event-members/${eventId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  const data = res.data;
  return data.map((member) => ({
    id: member.id,
    name: member.name,
    firebase_uid: member.firebase_uid
  }));
}
const ERROR_EMAIL_REQUIRED = "請輸入 Email";
const ERROR_NAME_DUPLICATE = "此成員名稱已存在";
const ERROR_EMAIL_CHECK = "檢查 Email 錯誤：";
const ERROR_EXISTING_USER = "加入現有用戶失敗：";
const ERROR_REGISTER = "註冊或同步失敗：";
function generateRandomPassword(length) {
  return Math.random().toString(36).slice(-10);
}
async function addExistingUserToEvent({
  userId,
  eventId,
  clearInput,
  refreshEventDetail,
  setErrorMessage,
  setShowError
}) {
  try {
    await addEventMember({ event_id: eventId, user_id: userId });
    clearInput();
    refreshEventDetail();
  } catch (err) {
    setErrorMessage(ERROR_EXISTING_USER + ((err == null ? void 0 : err.message) || ""));
    setShowError(true);
  }
}
async function registerAndAddNewUser({
  email,
  name,
  eventId,
  clearInput,
  refreshEventDetail,
  setErrorMessage,
  setShowError
}) {
  const password = generateRandomPassword();
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const idToken = await user.getIdToken();
    await fetchProtectedFindOrCreateUser({
      email: user.email,
      displayName: name.trim() || user.email,
      uid: user.uid,
      idToken
    });
    await addEventMember({ event_id: eventId, user_id: user.uid });
    clearInput();
    refreshEventDetail();
  } catch (err) {
    setErrorMessage(ERROR_REGISTER + ((err == null ? void 0 : err.message) || ""));
    setShowError(true);
  }
}
const isAuth = () => {
  return new Promise((resolve) => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      unsubscribe();
      resolve(!!user);
    });
  });
};
async function clientLoader$1({ params }) {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw new Response("未登入", { status: 401 });
  }
  const eventId = params.id;
  try {
    const data = await fetchProtectedEventDetail(eventId);
    return { event: data.data };
  } catch (err) {
    throw new Response(err.message || "資料載入失敗", { status: 500 });
  }
}
const EventDashboard = ({
  loaderData
}) => {
  const [event, setEvent] = useState(loaderData.event);
  const [showExpenses, setShowExpenses] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [removeConfirmMemberId, setRemoveConfirmMemberId] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  function clearMemberDialogInput() {
    setNewMemberEmail("");
    setNewMemberName("");
    setAddMemberDialogOpen(false);
    setShowError(false);
  }
  const handleAddMember = async () => {
    if (!newMemberEmail.trim()) {
      setErrorMessage("請輸入 Email");
      setErrorMessage(ERROR_EMAIL_REQUIRED);
      setShowError(true);
      return;
    }
    if (newMemberName.trim() && isDuplicateMemberName(newMemberName.trim(), event.members)) {
      setErrorMessage(ERROR_NAME_DUPLICATE);
      setShowError(true);
      return;
    }
    try {
      const emailExistsResult = await fetchEmailExists(newMemberEmail);
      if (emailExistsResult.exist) {
        await addExistingUserToEvent({
          userId: emailExistsResult.exists.firebase_uid,
          eventId: event.eventId,
          clearInput: clearMemberDialogInput,
          refreshEventDetail,
          setErrorMessage,
          setShowError
        });
        return;
      }
      await registerAndAddNewUser({
        email: newMemberEmail,
        name: newMemberName,
        eventId: event.eventId,
        clearInput: clearMemberDialogInput,
        refreshEventDetail,
        setErrorMessage,
        setShowError
      });
    } catch (err) {
      setErrorMessage(ERROR_EMAIL_CHECK + ((err == null ? void 0 : err.message) || ""));
      setShowError(true);
    }
  };
  const canDeleteMember = (memberId) => {
    return !event.expenses.some((expense) => expense.paidBy === memberId);
  };
  const handleRemoveMember = (memberId) => {
    if (!canDeleteMember(memberId)) {
      setErrorMessage("此成員已參與費用記錄，無法移除");
      setShowError(true);
      return;
    }
    setRemoveConfirmMemberId(null);
    setShowError(false);
  };
  const handleDeleteExpense = async (expenseId) => {
    var _a, _b;
    try {
      setErrorMessage("");
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      await axiosInstance.delete(`/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      await refreshEventDetail();
    } catch (error) {
      setErrorMessage(((_b = (_a = error == null ? void 0 : error.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || error.message || "刪除費用失敗");
    }
  };
  const handleSettleEvent = async () => {
    const totalBalance = (event == null ? void 0 : event.balances.reduce((sum, b) => sum + b.amount, 0)) || 0;
    if (Math.abs(totalBalance) > 0.01) {
      setErrorMessage("餘額總和不為 0，請檢查費用");
      return;
    }
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      await axiosInstance.post(`/settlement/events/${event.eventId}/settle`, {}, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      refreshEventDetail();
    } catch (err) {
      setErrorMessage("結算失敗，請稍後再試。");
    }
  };
  const refreshEventDetail = async () => {
    try {
      const newEvent = await fetchProtectedEventDetail(event.eventId);
      setEvent(newEvent.data);
    } catch (err) {
      setErrorMessage("重新載入失敗，請稍後再試。");
    }
  };
  const renderMemberAvatars = () => {
    return /* @__PURE__ */ jsxs("div", {
      className: "w-full flex p-3 bg-white border border-[#D1D5DB] rounded-lg overflow-scroll",
      children: [/* @__PURE__ */ jsxs(Dialog, {
        open: addMemberDialogOpen,
        onOpenChange: setAddMemberDialogOpen,
        children: [/* @__PURE__ */ jsx(DialogTrigger, {
          asChild: true,
          children: /* @__PURE__ */ jsxs("div", {
            className: "flex flex-col items-center mr-4",
            children: [/* @__PURE__ */ jsx("div", {
              className: "w-10 h-10 bg-[#0066CC] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0052A3] transition-colors",
              children: /* @__PURE__ */ jsx(Plus, {
                className: "h-5 w-5 text-white"
              })
            }), /* @__PURE__ */ jsx("span", {
              className: "text-xs mt-1 text-black",
              children: "新增"
            })]
          })
        }), /* @__PURE__ */ jsxs(DialogContent, {
          className: "sm:max-w-[425px] bg-white text-black",
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: "發送邀請"
            })
          }), /* @__PURE__ */ jsxs("div", {
            className: "py-4",
            children: [showError && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center space-x-2 mb-2 p-2 bg-red-50 rounded text-red-600 text-sm",
              children: [/* @__PURE__ */ jsx(AlertTriangle, {
                className: "h-4 w-4"
              }), /* @__PURE__ */ jsx("span", {
                children: errorMessage
              })]
            }), /* @__PURE__ */ jsx(Input, {
              placeholder: "輸入成員名稱 (選填)",
              value: newMemberName,
              onChange: (e) => setNewMemberName(e.target.value),
              className: "mb-2"
            }), /* @__PURE__ */ jsx(Input, {
              placeholder: "輸入 Email",
              value: newMemberEmail,
              onChange: (e) => setNewMemberEmail(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddMember();
                }
              }
            })]
          }), /* @__PURE__ */ jsxs(DialogFooter, {
            children: [/* @__PURE__ */ jsx(Button, {
              variant: "outline",
              className: "w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90",
              onClick: () => {
                setAddMemberDialogOpen(false);
                setShowError(false);
                setNewMemberName("");
              },
              children: "取消"
            }), /* @__PURE__ */ jsx(Button, {
              onClick: handleAddMember,
              disabled: !newMemberName.trim(),
              className: "w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
              children: "添加"
            })]
          })]
        })]
      }), event.members.length > 0 && /* @__PURE__ */ jsx("div", {
        className: "h-10 w-px bg-[#D1D5DB] mx-2"
      }), event.members.map((member) => /* @__PURE__ */ jsxs("div", {
        className: "flex flex-col items-center mx-2 relative group",
        children: [/* @__PURE__ */ jsxs(Avatar, {
          className: "w-10 h-10 border-2 border-transparent group-hover:border-[#0066CC] transition-colors",
          children: [/* @__PURE__ */ jsx(AvatarImage, {
            src: member.avatar,
            alt: member.name
          }), /* @__PURE__ */ jsx(AvatarFallback, {
            className: "bg-[#F3F4F6]",
            children: member.name.charAt(0).toUpperCase()
          })]
        }), /* @__PURE__ */ jsx("span", {
          className: "text-xs mt-1 text-black",
          children: member.name
        }), /* @__PURE__ */ jsxs(AlertDialog, {
          open: removeConfirmMemberId === member.id,
          onOpenChange: (open) => !open && setRemoveConfirmMemberId(null),
          children: [/* @__PURE__ */ jsx(AlertDialogTrigger, {
            asChild: true,
            children: /* @__PURE__ */ jsx("button", {
              className: "absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600",
              onClick: () => setRemoveConfirmMemberId(member.id),
              children: /* @__PURE__ */ jsx(X, {
                className: "h-3 w-3 text-white"
              })
            })
          }), /* @__PURE__ */ jsxs(AlertDialogContent, {
            children: [/* @__PURE__ */ jsxs(AlertDialogHeader, {
              children: [/* @__PURE__ */ jsx(AlertDialogTitle, {
                children: "移除成員"
              }), /* @__PURE__ */ jsx(AlertDialogDescription, {
                children: showError ? /* @__PURE__ */ jsxs("div", {
                  className: "flex items-center space-x-2 text-red-600",
                  children: [/* @__PURE__ */ jsx(AlertTriangle, {
                    className: "h-4 w-4"
                  }), /* @__PURE__ */ jsx("span", {
                    children: errorMessage
                  })]
                }) : /* @__PURE__ */ jsxs(Fragment, {
                  children: ["確定要移除成員 ", member.name, " 嗎？", /* @__PURE__ */ jsx("br", {}), "移除後無法恢復，且已參與費用記錄的成員無法移除。"]
                })
              })]
            }), /* @__PURE__ */ jsxs(AlertDialogFooter, {
              children: [/* @__PURE__ */ jsx(AlertDialogCancel, {
                onClick: () => {
                  setShowError(false);
                  setRemoveConfirmMemberId(null);
                },
                children: "取消"
              }), /* @__PURE__ */ jsx(AlertDialogAction, {
                onClick: () => handleRemoveMember(member.id),
                className: "bg-red-500 hover:bg-red-600",
                children: "確認移除"
              })]
            })]
          })]
        })]
      }, member.id))]
    });
  };
  return event ? /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: event.title,
      path: "/"
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-base font-medium text-[#263238] mb-2",
        children: "成員"
      }), event && renderMemberAvatars()]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mb-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-base font-medium text-[#263238] mb-2",
        children: "類別分佈與統計"
      }), /* @__PURE__ */ jsx("div", {
        className: "p-3 bg-white border border-[#D1D5DB] rounded-lg",
        children: /* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center",
          children: [/* @__PURE__ */ jsx(DonutChart, {
            data: event.categoryDistribution,
            totalAmount: event.totalAmount
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center gap-2 mt-2",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "text-xs text-[#263238]",
              children: ["參與人數：", event.members.length, " 人"]
            }), /* @__PURE__ */ jsxs("div", {
              className: "text-xs text-[#263238]",
              children: ["人均花費：$", (event.totalAmount / event.members.length).toFixed(2)]
            })]
          })]
        })
      })]
    }), (event.status === "settled" || event.status === "finalized") && /* @__PURE__ */ jsxs("div", {
      className: "text-center mb-4",
      children: [event.status === "settled" && /* @__PURE__ */ jsx("p", {
        className: "text-base font-medium text-green-500",
        children: "已結算"
      }), event.status === "finalized" && /* @__PURE__ */ jsx("p", {
        className: "text-base font-medium text-yellow-500",
        children: "已結束"
      }), /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        className: "mt-2 w-48 border-[#D1D5DB] rounded-md",
        onClick: () => setShowExpenses(!showExpenses),
        children: showExpenses ? "隱藏費用列表" : "展開費用列表"
      })]
    }), event.status !== "settled" && event.status !== "finalized" || showExpenses ? /* @__PURE__ */ jsxs("div", {
      className: "mb-4",
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-between items-center mb-2",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-base font-medium text-[#263238]",
          children: "費用列表"
        }), event.status !== "settled" && event.status !== "finalized" && /* @__PURE__ */ jsx(Link, {
          to: {
            pathname: `/addExpense/${event.eventId}`
          },
          children: /* @__PURE__ */ jsx(Button, {
            className: "bg-[#00C4CC] text-white cursor-pointer rounded px-3 h-9 hover:bg-[#00B0B6]",
            children: "新增費用"
          })
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "space-y-2",
        children: event.expenses.length === 0 ? /* @__PURE__ */ jsx("div", {
          className: "text-sm text-center text-gray-400",
          children: "目前無費用記錄"
        }) : event.expenses.map((exp) => /* @__PURE__ */ jsx(Card, {
          className: "w-full h-14 border border-[#D1D5DB] rounded-lg",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "flex items-center justify-between h-full px-4",
            children: [/* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx("span", {
                className: "text-lg",
                children: exp.category === "food" ? "🍽️" : exp.category === "drinks" ? "🥤" : "📦"
              }), /* @__PURE__ */ jsxs("p", {
                className: "text-sm text-[#263238]",
                children: [exp.title, " - $", exp.amount]
              })]
            }), event.status !== "settled" && event.status !== "finalized" && /* @__PURE__ */ jsxs("div", {
              className: "flex items-center gap-2",
              children: [/* @__PURE__ */ jsx(Link, {
                to: `/expenseDetails/${exp.id}`,
                children: /* @__PURE__ */ jsx(Button, {
                  variant: "ghost",
                  size: "icon",
                  children: /* @__PURE__ */ jsx(Pencil, {
                    className: "w-4 h-4 text-[#00C4CC]"
                  })
                })
              }), /* @__PURE__ */ jsx(Button, {
                variant: "ghost",
                size: "icon",
                onClick: () => handleDeleteExpense(exp.id),
                children: /* @__PURE__ */ jsx(Trash2, {
                  className: "w-4 h-4 text-red-500"
                })
              })]
            })]
          })
        }, exp.id))
      })]
    }) : null, (event.status === "settled" || event.status === "finalized") && /* @__PURE__ */ jsxs("div", {
      className: "mb-4",
      children: [event.debts.length > 0 && /* @__PURE__ */ jsx(DebtOverview, {
        debts: event.debts,
        onPaidSuccess: refreshEventDetail
      }), event.debts.length === 0 && /* @__PURE__ */ jsx("div", {
        className: "text-sm text-center text-gray-400",
        children: "目前無債務關係"
      })]
    }), event.status !== "settled" && event.status !== "finalized" && /* @__PURE__ */ jsxs("div", {
      className: "text-center mt-4",
      children: [errorMessage && /* @__PURE__ */ jsx("p", {
        className: "text-xs text-red-500 mb-2",
        children: errorMessage
      }), /* @__PURE__ */ jsx(Button, {
        className: "w-full bg-[#FF5733] cursor-pointer text-white rounded h-12 hover:bg-[#E84C2E]",
        onClick: handleSettleEvent,
        children: "結算"
      })]
    })]
  }) : /* @__PURE__ */ jsx(LoadingSpinner, {
    text: "活動資料載入中..."
  });
};
const eventDashboard = withComponentProps(EventDashboard);
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader: clientLoader$1,
  default: eventDashboard
}, Symbol.toStringTag, { value: "Module" }));
function RadioGroup({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Root,
    {
      "data-slot": "radio-group",
      className: cn("grid gap-3", className),
      ...props
    }
  );
}
function RadioGroupItem({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    RadioGroupPrimitive.Item,
    {
      "data-slot": "radio-group-item",
      className: cn(
        "border-input text-primary focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 aspect-square size-4 shrink-0 rounded-full border shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        RadioGroupPrimitive.Indicator,
        {
          "data-slot": "radio-group-indicator",
          className: "relative flex items-center justify-center",
          children: /* @__PURE__ */ jsx(CircleIcon, { className: "fill-primary absolute top-1/2 left-1/2 size-2 -translate-x-1/2 -translate-y-1/2" })
        }
      )
    }
  );
}
function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}
function Select({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Root, { "data-slot": "select", ...props });
}
function SelectValue({
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Value, { "data-slot": "select-value", ...props });
}
function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Trigger,
    {
      "data-slot": "select-trigger",
      "data-size": size,
      className: cn(
        "border-input data-[placeholder]:text-muted-foreground [&_svg:not([class*='text-'])]:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 dark:hover:bg-input/50 flex w-fit items-center justify-between gap-2 rounded-md border bg-transparent px-3 py-2 text-sm whitespace-nowrap shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[size=default]:h-9 data-[size=sm]:h-8 *:data-[slot=select-value]:line-clamp-1 *:data-[slot=select-value]:flex *:data-[slot=select-value]:items-center *:data-[slot=select-value]:gap-2 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props,
      children: [
        children,
        /* @__PURE__ */ jsx(SelectPrimitive.Icon, { asChild: true, children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4 opacity-50" }) })
      ]
    }
  );
}
function SelectContent({
  className,
  children,
  position = "popper",
  ...props
}) {
  return /* @__PURE__ */ jsx(SelectPrimitive.Portal, { children: /* @__PURE__ */ jsxs(
    SelectPrimitive.Content,
    {
      "data-slot": "select-content",
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 max-h-(--radix-select-content-available-height) min-w-[8rem] origin-(--radix-select-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border shadow-md",
        position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
        className
      ),
      position,
      ...props,
      children: [
        /* @__PURE__ */ jsx(SelectScrollUpButton, {}),
        /* @__PURE__ */ jsx(
          SelectPrimitive.Viewport,
          {
            className: cn(
              "p-1",
              position === "popper" && "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)] scroll-my-1"
            ),
            children
          }
        ),
        /* @__PURE__ */ jsx(SelectScrollDownButton, {})
      ]
    }
  ) });
}
function SelectItem({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    SelectPrimitive.Item,
    {
      "data-slot": "select-item",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground [&_svg:not([class*='text-'])]:text-muted-foreground relative flex w-full cursor-default items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
        className
      ),
      ...props,
      children: [
        /* @__PURE__ */ jsx("span", { className: "absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(SelectPrimitive.ItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, { className: "size-4" }) }) }),
        /* @__PURE__ */ jsx(SelectPrimitive.ItemText, { children })
      ]
    }
  );
}
function SelectScrollUpButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollUpButton,
    {
      "data-slot": "select-scroll-up-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronUpIcon, { className: "size-4" })
    }
  );
}
function SelectScrollDownButton({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SelectPrimitive.ScrollDownButton,
    {
      "data-slot": "select-scroll-down-button",
      className: cn(
        "flex cursor-default items-center justify-center py-1",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(ChevronDownIcon, { className: "size-4" })
    }
  );
}
async function fetchCategories() {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  const response = await axiosInstance.get("/categories", {
    headers: {
      Authorization: `Bearer ${idToken}`
    }
  });
  return response.data;
}
async function clientLoader({
  params
}) {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw new Response("未登入", { status: 401 });
  }
  const eventId = params.id;
  if (!eventId) throw new Response("缺少 eventId", { status: 400 });
  const [members, categories] = await Promise.all([
    fetchEventMembers(eventId),
    fetchCategories()
  ]);
  return { members, categories, eventId };
}
function AddExpense({
  loaderData
}) {
  const navigate = useNavigate();
  const [members] = useState(loaderData.members.map((m) => m.name));
  const [categories] = useState(loaderData.categories);
  const [form, setForm] = useState({
    description: "",
    total: "",
    payers: loaderData.members.reduce((acc, m) => {
      acc[m.name] = 0;
      return acc;
    }, {}),
    splitType: "even",
    shares: loaderData.members.reduce((acc, m) => {
      acc[m.name] = 0;
      return acc;
    }, {}),
    note: "",
    category: ""
  });
  const [error, setError] = useState("");
  const handleSave = async () => {
    var _a, _b;
    if (!form.description || !form.total) {
      setError("描述與總額為必填");
      return;
    }
    const totalPaid = Object.values(form.payers).reduce((sum, amount) => sum + Number(amount), 0);
    const totalShared = form.splitType === "even" ? totalPaid : Object.values(form.shares).reduce((sum, amount) => sum + Number(amount), 0);
    if (totalPaid !== Number(form.total) || totalShared !== Number(form.total)) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }
    try {
      const eventId = loaderData.eventId;
      if (!eventId) {
        setError("找不到 eventId");
        return;
      }
      let categoryId = null;
      if (form.category) {
        const cat = loaderData.categories.find((c) => c.name === form.category);
        if (cat) categoryId = cat.id;
      }
      const getUserIdByName = (name) => {
        const member = loaderData.members.find((m) => m.name === name);
        return member ? member.firebase_uid : null;
      };
      const payers = Object.entries(form.payers).filter(([_, amount]) => Number(amount) > 0).map(([name, amount]) => ({
        userId: getUserIdByName(name),
        name,
        amount: Number(amount)
      }));
      const shares = Object.entries(form.shares).map(([name, amount]) => ({
        userId: getUserIdByName(name),
        name,
        amount: form.splitType === "even" ? Number(form.total) / loaderData.members.length : Number(amount)
      }));
      console.log("shares", shares);
      const {
        auth: auth2
      } = await Promise.resolve().then(() => firebase);
      const user = auth2.currentUser;
      if (!user) {
        setError("尚未登入");
        return;
      }
      const idToken = await user.getIdToken();
      const {
        default: axiosInstance2
      } = await Promise.resolve().then(() => axios);
      const now = (/* @__PURE__ */ new Date()).toISOString();
      const apiPayload = {
        eventId,
        description: form.description,
        total: Number(form.total),
        categoryId,
        payers,
        shares,
        note: form.note || null,
        createdAt: now
      };
      await axiosInstance2.post("/expenses", apiPayload, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      navigate(`/events/${eventId}`);
    } catch (error2) {
      setError(((_b = (_a = error2 == null ? void 0 : error2.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || error2.message || "新增費用失敗，請稍後再試");
    }
  };
  const handleCancel = () => {
    navigate(-1);
  };
  const handleSplitChange = (value) => {
    setForm((prev) => {
      const total = Number(prev.total) || 0;
      const shareAmount = total / members.length;
      const shares = members.reduce((acc, member) => ({
        ...acc,
        [member]: value === "even" ? shareAmount : prev.shares[member]
      }), {});
      return {
        ...prev,
        splitType: value,
        shares
      };
    });
  };
  return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: "新增費用"
    }), /* @__PURE__ */ jsxs("div", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "描述"
        }), /* @__PURE__ */ jsx(Input, {
          value: form.description,
          onChange: (e) => setForm({
            ...form,
            description: e.target.value
          }),
          placeholder: "輸入費用描述",
          className: "mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "總額 (TWD)"
        }), /* @__PURE__ */ jsx(Input, {
          type: "number",
          value: form.total,
          onChange: (e) => setForm({
            ...form,
            total: e.target.value
          }),
          placeholder: "輸入總額",
          className: "mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "付款人"
        }), /* @__PURE__ */ jsx("div", {
          className: "space-y-2 mt-1",
          children: members.map((member) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "w-20 text-[#263238]",
              children: member
            }), /* @__PURE__ */ jsx(Input, {
              type: "number",
              value: form.payers[member],
              onChange: (e) => setForm({
                ...form,
                payers: {
                  ...form.payers,
                  [member]: e.target.value
                }
              }),
              className: "w-20 h-8 border-[#D1D5DB] rounded-md bg-white text-[#263238]"
            })]
          }, member))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "分攤方式"
        }), /* @__PURE__ */ jsxs(RadioGroup, {
          value: form.splitType,
          onValueChange: handleSplitChange,
          className: "mt-1 flex space-x-4",
          children: [/* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx(RadioGroupItem, {
              value: "even",
              id: "even"
            }), /* @__PURE__ */ jsx(Label, {
              htmlFor: "even",
              className: "text-[#263238] text-sm",
              children: "平均分"
            })]
          }), /* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx(RadioGroupItem, {
              value: "manual",
              id: "manual"
            }), /* @__PURE__ */ jsx(Label, {
              htmlFor: "manual",
              className: "text-[#263238] text-sm",
              children: "手動調"
            })]
          })]
        })]
      }), form.splitType === "manual" && /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "分攤金額"
        }), /* @__PURE__ */ jsx("div", {
          className: "space-y-2 mt-1",
          children: members.map((member) => /* @__PURE__ */ jsxs("div", {
            className: "flex items-center space-x-2",
            children: [/* @__PURE__ */ jsx("span", {
              className: "w-20 text-[#263238]",
              children: member
            }), /* @__PURE__ */ jsx(Input, {
              type: "number",
              value: form.shares[member],
              onChange: (e) => setForm({
                ...form,
                shares: {
                  ...form.shares,
                  [member]: e.target.value
                }
              }),
              className: "w-20 h-8 border-[#D1D5DB] text-[#263238] rounded-md"
            })]
          }, member))
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "備註（選填）"
        }), /* @__PURE__ */ jsx(Input, {
          value: form.note,
          onChange: (e) => setForm({
            ...form,
            note: e.target.value
          }),
          placeholder: "備註（選填）",
          className: "mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx(Label, {
          className: "text-[#263238] text-sm font-medium",
          children: "類別（選填）"
        }), /* @__PURE__ */ jsxs(Select, {
          onValueChange: (value) => setForm({
            ...form,
            category: value
          }),
          value: form.category,
          children: [/* @__PURE__ */ jsx(SelectTrigger, {
            className: "mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black",
            children: /* @__PURE__ */ jsx(SelectValue, {
              placeholder: "選擇類別"
            })
          }), /* @__PURE__ */ jsx(SelectContent, {
            children: categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, {
              value: cat.name,
              children: cat.name
            }, cat.id))
          })]
        })]
      }), error && /* @__PURE__ */ jsx("p", {
        className: "text-[#EF4444] text-xs",
        children: error
      })]
    }), /* @__PURE__ */ jsxs("div", {
      className: "mt-4 flex justify-end space-x-2",
      children: [/* @__PURE__ */ jsx(Button, {
        variant: "outline",
        onClick: handleCancel,
        className: "w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90",
        children: "取消"
      }), /* @__PURE__ */ jsx(Button, {
        onClick: handleSave,
        className: "w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
        children: "儲存"
      })]
    })]
  });
}
const addExpense = withComponentProps(AddExpense);
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  clientLoader,
  default: addExpense
}, Symbol.toStringTag, { value: "Module" }));
async function fetchProtectedExpenseDetail(expenseId) {
  var _a;
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.get(
      `/expenses/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      }
    );
    return response.data.data;
  } catch (error) {
    if (axios$1.isAxiosError(error) && error.response) {
      throw new Error(((_a = error.response.data) == null ? void 0 : _a.message) || "取得費用詳情失敗");
    }
    throw new Error("取得費用詳情失敗");
  }
}
function ExpenseDetailCard({ expense }) {
  return /* @__PURE__ */ jsx(Card, { children: /* @__PURE__ */ jsxs(CardContent, { className: "space-y-1 pt-4", children: [
    /* @__PURE__ */ jsx("div", { className: "text-base font-semibold text-gray-800", children: expense.title }),
    /* @__PURE__ */ jsxs("div", { className: "text-2xl font-bold text-gray-800", children: [
      "$",
      expense.amount.toFixed(2)
    ] }),
    /* @__PURE__ */ jsx("div", { className: "text-sm text-gray-500", children: expense.date })
  ] }) });
}
function ExpenseParticipantsInfo({
  payers,
  shares
}) {
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm font-medium text-gray-800", children: [
        /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "付款人" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pl-2 pt-2 space-y-2", children: payers.map((payer) => /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
        payer.name,
        "：$",
        payer.amount.toFixed(2)
      ] }, payer.userId)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm font-medium text-gray-800", children: [
        /* @__PURE__ */ jsx(User, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "分攤金額" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pl-2 pt-2 space-y-2", children: shares.map((share) => /* @__PURE__ */ jsxs("div", { className: "text-gray-700", children: [
        share.name,
        "：$",
        share.amount.toFixed(2)
      ] }, share.userId)) })
    ] })
  ] });
}
function ExpenseMetaInfo({ expense }) {
  const splitMethodText = {
    equal: "平均分攤",
    exact: "自定義金額",
    percentage: "依比例分攤"
  };
  return /* @__PURE__ */ jsxs("div", { className: "space-y-6", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-1 text-sm font-medium text-gray-800", children: [
        /* @__PURE__ */ jsx(Info, { className: "w-4 h-4" }),
        /* @__PURE__ */ jsx("span", { children: "分攤方式" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "pl-2 pt-2 text-gray-700", children: splitMethodText[expense.splitMethod] })
    ] }),
    expense.note && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-800", children: "備註" }),
      /* @__PURE__ */ jsx("div", { className: "pl-2 pt-2 text-gray-700", children: expense.note })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("div", { className: "text-sm font-medium text-gray-800", children: "類別" }),
      /* @__PURE__ */ jsx("div", { className: "pl-2 pt-2 text-gray-700", children: expense.category })
    ] })
  ] });
}
function ExpenseActionButtons({
  onEdit,
  onDelete
}) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };
  return /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsxs("div", { className: "flex justify-between pt-4", children: [
    /* @__PURE__ */ jsxs(
      Button,
      {
        onClick: onEdit,
        className: "bg-[#FFC107] text-white hover:bg-yellow-500",
        children: [
          /* @__PURE__ */ jsx(Pencil, { className: "mr-2 h-4 w-4" }),
          " 編輯"
        ]
      }
    ),
    /* @__PURE__ */ jsxs(
      AlertDialog,
      {
        open: showDeleteConfirm,
        onOpenChange: setShowDeleteConfirm,
        children: [
          /* @__PURE__ */ jsx(AlertDialogTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
            Button,
            {
              onClick: handleDelete,
              className: "bg-red-500 text-white hover:bg-red-600",
              children: [
                /* @__PURE__ */ jsx(Trash2, { className: "mr-2 h-4 w-4" }),
                " 刪除"
              ]
            }
          ) }),
          /* @__PURE__ */ jsxs(AlertDialogContent, { children: [
            /* @__PURE__ */ jsx(AlertDialogHeader, { children: "確定要刪除這筆費用嗎？" }),
            /* @__PURE__ */ jsxs(AlertDialogFooter, { children: [
              /* @__PURE__ */ jsx(
                Button,
                {
                  variant: "outline",
                  onClick: () => setShowDeleteConfirm(false),
                  children: "取消"
                }
              ),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "bg-red-500 text-white",
                  onClick: confirmDelete,
                  children: "確定刪除"
                }
              )
            ] })
          ] })
        ]
      }
    )
  ] }) });
}
const Form = FormProvider;
const FormFieldContext = React.createContext(
  {}
);
const FormField = ({
  ...props
}) => {
  return /* @__PURE__ */ jsx(FormFieldContext.Provider, { value: { name: props.name }, children: /* @__PURE__ */ jsx(Controller, { ...props }) });
};
const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext);
  const itemContext = React.useContext(FormItemContext);
  const { getFieldState } = useFormContext();
  const formState = useFormState({ name: fieldContext.name });
  const fieldState = getFieldState(fieldContext.name, formState);
  if (!fieldContext) {
    throw new Error("useFormField should be used within <FormField>");
  }
  const { id } = itemContext;
  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState
  };
};
const FormItemContext = React.createContext(
  {}
);
function FormItem({ className, ...props }) {
  const id = React.useId();
  return /* @__PURE__ */ jsx(FormItemContext.Provider, { value: { id }, children: /* @__PURE__ */ jsx(
    "div",
    {
      "data-slot": "form-item",
      className: cn("grid gap-2", className),
      ...props
    }
  ) });
}
function FormLabel({
  className,
  ...props
}) {
  const { error, formItemId } = useFormField();
  return /* @__PURE__ */ jsx(
    Label,
    {
      "data-slot": "form-label",
      "data-error": !!error,
      className: cn("data-[error=true]:text-destructive", className),
      htmlFor: formItemId,
      ...props
    }
  );
}
function FormControl({ ...props }) {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();
  return /* @__PURE__ */ jsx(
    Slot,
    {
      "data-slot": "form-control",
      id: formItemId,
      "aria-describedby": !error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`,
      "aria-invalid": !!error,
      ...props
    }
  );
}
function FormMessage({ className, ...props }) {
  const { error, formMessageId } = useFormField();
  const body = error ? String((error == null ? void 0 : error.message) ?? "") : props.children;
  if (!body) {
    return null;
  }
  return /* @__PURE__ */ jsx(
    "p",
    {
      "data-slot": "form-message",
      id: formMessageId,
      className: cn("text-destructive text-sm", className),
      ...props,
      children: body
    }
  );
}
function useEventMembers(eventId) {
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (!eventId) {
      setMembers([]);
      setError("eventId is required");
      return;
    }
    setIsLoading(true);
    setError(null);
    fetchEventMembers(eventId).then(setMembers).catch((err) => {
      setError(err.message || "取得成員失敗");
      setMembers([]);
    }).finally(() => setIsLoading(false));
  }, [eventId]);
  return { members, isLoading, error };
}
function useCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    setIsLoading(true);
    setError(null);
    fetchCategories().then(setCategories).catch((err) => {
      setError(err.message || "取得類別失敗");
      setCategories([]);
    }).finally(() => setIsLoading(false));
  }, []);
  return { categories, isLoading, error };
}
const expenseFormSchema = z.object({
  title: z.string().min(1, "請輸入費用名稱"),
  amount: z.coerce.number().min(0.01, "金額必須大於 0").max(1e6, "金額太大"),
  date: z.string().min(1, "請選擇日期"),
  category: z.string().min(1, "請選擇類別"),
  splitType: z.enum(["even", "manual"], {
    required_error: "請選擇分攤方式"
  }),
  note: z.string().optional(),
  payers: z.record(z.string(), z.coerce.number()),
  shares: z.record(z.string(), z.coerce.number())
});
function ExpenseEditForm({
  expense,
  eventId,
  onSubmit,
  onCancel
}) {
  const {
    members,
    isLoading: isMembersLoading,
    error: memberError
  } = useEventMembers(eventId ? String(eventId) : void 0);
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError
  } = useCategories();
  const [error, setError] = useState("");
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);
  function buildMemberAmountMap(members2 = [], arr = []) {
    const map = new Map(arr.map((item) => [String(item.userId), item.amount]));
    return members2.reduce((acc, m) => {
      acc[String(m.id)] = map.get(String(m.firebase_uid)) ?? 0;
      return acc;
    }, {});
  }
  const form = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: (expense == null ? void 0 : expense.title) || "",
      amount: (expense == null ? void 0 : expense.amount) || 0,
      date: (expense == null ? void 0 : expense.date) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      category: (expense == null ? void 0 : expense.category) || "餐費",
      splitType: (expense == null ? void 0 : expense.splitMethod) === "equal" ? "even" : "manual",
      note: (expense == null ? void 0 : expense.note) || "",
      payers: {},
      // 先給空物件，等 members 載入後 reset
      shares: {}
    }
  });
  useEffect(() => {
    if (!members || members.length === 0) return;
    form.reset({
      title: (expense == null ? void 0 : expense.title) || "",
      amount: (expense == null ? void 0 : expense.amount) || 0,
      date: (expense == null ? void 0 : expense.date) || (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
      category: (expense == null ? void 0 : expense.category) || "餐費",
      splitType: (expense == null ? void 0 : expense.splitMethod) === "equal" ? "even" : "manual",
      note: (expense == null ? void 0 : expense.note) || "",
      payers: buildMemberAmountMap(members, expense == null ? void 0 : expense.payers),
      shares: buildMemberAmountMap(members, expense == null ? void 0 : expense.shares)
    });
  }, [members, categories, expense]);
  const watchAmount = form.watch("amount");
  const watchSplitType = form.watch("splitType");
  useEffect(() => {
    if (watchSplitType === "even" && watchAmount && memberIds.length > 0) {
      const shareAmount = Number(watchAmount) / memberIds.length;
      const shares = memberIds.reduce(
        (acc, id) => ({ ...acc, [id]: shareAmount }),
        {}
      );
      form.setValue("shares", shares);
    }
  }, [watchAmount, watchSplitType, memberIds, form]);
  const handleSubmit = (data) => {
    const totalPaid = Object.values(data.payers).reduce(
      (sum, amount) => sum + Number(amount),
      0
    );
    const totalShared = Object.values(data.shares).reduce(
      (sum, amount) => sum + Number(amount),
      0
    );
    if (totalPaid !== Number(data.amount) || totalShared !== Number(data.amount)) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }
    const formattedData = {
      ...data,
      payers: Object.entries(data.payers).map(([name, amount]) => ({
        userId: name,
        name,
        amount: Number(amount)
      })),
      shares: Object.entries(data.shares).map(([name, amount]) => ({
        userId: name,
        name,
        amount: Number(amount)
      }))
    };
    onSubmit(formattedData);
  };
  if (isMembersLoading || isCategoriesLoading) {
    return /* @__PURE__ */ jsx("div", { children: "資料載入中..." });
  }
  if (memberError) {
    return /* @__PURE__ */ jsxs("div", { className: "text-red-500", children: [
      "成員載入失敗：",
      memberError
    ] });
  }
  if (categoriesError) {
    return /* @__PURE__ */ jsxs("div", { className: "text-red-500", children: [
      "類別載入失敗：",
      categoriesError
    ] });
  }
  return /* @__PURE__ */ jsx(Form, { ...form, children: /* @__PURE__ */ jsxs("form", { onSubmit: form.handleSubmit(handleSubmit), className: "space-y-6", children: [
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: "title",
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "描述" }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "輸入費用描述", ...field }) }),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: "amount",
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "總額 (TWD)" }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
            Input,
            {
              type: "number",
              step: "0.01",
              placeholder: "輸入總額",
              ...field,
              value: field.value ?? 0
            }
          ) }),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "text-[#263238] text-sm font-medium", children: "付款人" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 mt-1", children: members.map((member) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-20 text-[#263238]", children: member.name }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: `payers.${member.id}`,
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  className: "w-32 h-8 border-[#D1D5DB] rounded-md bg-white",
                  ...field,
                  value: field.value ?? 0
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }, member.id)) })
    ] }),
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "text-[#263238] text-sm font-medium", children: "分攤方式" }),
      /* @__PURE__ */ jsx(
        FormField,
        {
          control: form.control,
          name: "splitType",
          render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
            /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(
              RadioGroup,
              {
                onValueChange: field.onChange,
                value: field.value,
                className: "mt-1 flex space-x-4",
                children: [
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(RadioGroupItem, { value: "even", id: "even" }),
                    /* @__PURE__ */ jsx(Label, { htmlFor: "even", className: "text-[#263238] text-sm", children: "平均分" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
                    /* @__PURE__ */ jsx(RadioGroupItem, { value: "manual", id: "manual" }),
                    /* @__PURE__ */ jsx(
                      Label,
                      {
                        htmlFor: "manual",
                        className: "text-[#263238] text-sm",
                        children: "手動調"
                      }
                    )
                  ] })
                ]
              }
            ) }),
            /* @__PURE__ */ jsx(FormMessage, {})
          ] })
        }
      )
    ] }),
    watchSplitType === "manual" && /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx(Label, { className: "text-[#263238] text-sm font-medium", children: "分攤金額" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2 mt-1", children: members.map((member) => /* @__PURE__ */ jsxs("div", { className: "flex items-center space-x-2", children: [
        /* @__PURE__ */ jsx("span", { className: "w-20 text-[#263238]", children: member.name }),
        /* @__PURE__ */ jsx(
          FormField,
          {
            control: form.control,
            name: `shares.${member.id}`,
            render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
              /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(
                Input,
                {
                  type: "number",
                  className: "w-32 h-8 border-[#D1D5DB] rounded-md",
                  ...field,
                  value: field.value ?? 0
                }
              ) }),
              /* @__PURE__ */ jsx(FormMessage, {})
            ] })
          }
        )
      ] }, member.id)) })
    ] }),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: "category",
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "類別" }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [
            /* @__PURE__ */ jsx(SelectTrigger, { children: /* @__PURE__ */ jsx(SelectValue, { placeholder: "請選擇類別" }) }),
            /* @__PURE__ */ jsx(SelectContent, { children: categories.map((cat) => /* @__PURE__ */ jsx(SelectItem, { value: cat.name, children: cat.name }, cat.id)) })
          ] }) }),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    /* @__PURE__ */ jsx(
      FormField,
      {
        control: form.control,
        name: "note",
        render: ({ field }) => /* @__PURE__ */ jsxs(FormItem, { children: [
          /* @__PURE__ */ jsx(FormLabel, { children: "備註（選填）" }),
          /* @__PURE__ */ jsx(FormControl, { children: /* @__PURE__ */ jsx(Input, { placeholder: "備註（選填）", ...field }) }),
          /* @__PURE__ */ jsx(FormMessage, {})
        ] })
      }
    ),
    error && /* @__PURE__ */ jsx("p", { className: "text-[#EF4444] text-xs", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "flex justify-end gap-4", children: [
      /* @__PURE__ */ jsx(
        Button,
        {
          type: "button",
          variant: "outline",
          onClick: onCancel,
          className: "border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90",
          children: "取消"
        }
      ),
      /* @__PURE__ */ jsx(Button, { type: "submit", children: "儲存" })
    ] })
  ] }) });
}
const expenseDetail = withComponentProps(function ExpenseDetails() {
  const params = useParams();
  const id = params.id;
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchProtectedExpenseDetail(id).then(setExpense).catch((err) => setError(err.message || "發生未知錯誤")).finally(() => setLoading(false));
  }, [id]);
  const handleEdit = () => {
    setShowEditDialog(true);
  };
  const handleDelete = () => {
    console.log("刪除成功");
  };
  const handleEditSubmit = async (data) => {
    var _a, _b;
    if (!expense) return;
    setLoading(true);
    setError(null);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      const payload = {
        ...data
        // 若 API 需要 eventId 或其他欄位可加上
        // eventId: expense.eventId,
      };
      await axiosInstance.put(`/expenses/${expense.id}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`
        }
      });
      setExpense((prev) => prev ? {
        ...prev,
        ...data
      } : prev);
      setShowEditDialog(false);
    } catch (error2) {
      setError(((_b = (_a = error2 == null ? void 0 : error2.response) == null ? void 0 : _a.data) == null ? void 0 : _b.message) || error2.message || "更新費用失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
      children: [/* @__PURE__ */ jsx(PageHeader, {
        title: "費用詳情"
      }), /* @__PURE__ */ jsx("div", {
        children: "載入中..."
      })]
    });
  }
  if (error) {
    return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
      children: [/* @__PURE__ */ jsx(PageHeader, {
        title: "費用詳情"
      }), /* @__PURE__ */ jsx("div", {
        className: "text-red-500",
        children: error
      })]
    });
  }
  if (!expense) {
    return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
      children: [/* @__PURE__ */ jsx(PageHeader, {
        title: "費用詳情"
      }), /* @__PURE__ */ jsx("div", {
        children: "查無資料"
      })]
    });
  }
  return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: "費用詳情"
    }), /* @__PURE__ */ jsxs("div", {
      className: "space-y-6",
      children: [/* @__PURE__ */ jsx(ExpenseDetailCard, {
        expense
      }), /* @__PURE__ */ jsx(ExpenseParticipantsInfo, {
        payers: expense.payers,
        shares: expense.shares
      }), /* @__PURE__ */ jsx(ExpenseMetaInfo, {
        expense
      }), /* @__PURE__ */ jsx(ExpenseActionButtons, {
        onEdit: handleEdit,
        onDelete: handleDelete
      })]
    }), /* @__PURE__ */ jsx(Dialog, {
      open: showEditDialog,
      onOpenChange: setShowEditDialog,
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-[500px] bg-white text-black",
        children: [/* @__PURE__ */ jsx(DialogTitle, {
          children: "編輯費用"
        }), /* @__PURE__ */ jsx(ExpenseEditForm, {
          expense,
          eventId: expense.eventId,
          onSubmit: handleEditSubmit,
          onCancel: () => setShowEditDialog(false)
        })]
      })
    })]
  });
});
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenseDetail
}, Symbol.toStringTag, { value: "Module" }));
const GoogleIcon = () => /* @__PURE__ */ jsxs(
  "svg",
  {
    width: "20",
    height: "20",
    viewBox: "0 0 20 20",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    children: [
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.1712 8.36791H17.5V8.33333H10V11.6667H14.6954C14.0338 13.6071 12.1713 15 10 15C7.23875 15 5 12.7613 5 10C5 7.23871 7.23875 5 10 5C11.2746 5 12.4342 5.48621 13.3154 6.26625L15.6734 3.90791C14.1838 2.52333 12.195 1.66667 10 1.66667C5.3975 1.66667 1.66667 5.3975 1.66667 10C1.66667 14.6025 5.3975 18.3333 10 18.3333C14.6025 18.3333 18.3333 14.6025 18.3333 10C18.3333 9.44083 18.2742 8.89583 18.1712 8.36791Z",
          fill: "#FFC107"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M2.62915 6.12124L5.36582 8.12916C6.10999 6.29499 7.90082 5 10.0001 5C11.2747 5 12.4343 5.48621 13.3155 6.26625L15.6735 3.90791C14.1839 2.52333 12.1951 1.66667 10.0001 1.66667C6.78915 1.66667 4.02082 3.47374 2.62915 6.12124Z",
          fill: "#FF3D00"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M9.99992 18.3333C12.1524 18.3333 14.1034 17.5096 15.5825 16.17L13.0109 13.9862C12.1441 14.6318 11.0865 15 9.99992 15C7.83742 15 5.98158 13.6162 5.31408 11.6892L2.58325 13.785C3.95658 16.4817 6.76158 18.3333 9.99992 18.3333Z",
          fill: "#4CAF50"
        }
      ),
      /* @__PURE__ */ jsx(
        "path",
        {
          d: "M18.1712 8.36791H17.5V8.33333H10V11.6667H14.6954C14.3796 12.5902 13.7888 13.3972 13.01 13.9867L13.0112 13.9858L15.5829 16.1696C15.4112 16.3254 18.3333 14.1667 18.3333 10C18.3333 9.44083 18.2742 8.89583 18.1712 8.36791Z",
          fill: "#1976D2"
        }
      )
    ]
  }
);
function meta({}) {
  return [{
    title: "New React Router App - Login Page"
  }, {
    name: "description",
    content: "Login Page"
  }];
}
const login = withComponentProps(function Login() {
  const navigate = useNavigate();
  const {
    signInWithGoogle,
    currentUser
  } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (currentUser) {
      navigate("/");
    }
  }, []);
  const handleGoogleSignIn = async () => {
    try {
      setError("");
      setLoading(true);
      await signInWithGoogle();
      fetchProtectedData();
      navigate("/");
    } catch (error2) {
      console.error("登入失敗:", error2);
      setError("Google 登入失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "flex flex-col items-center justify-center h-screen bg-black relative overflow-hidden",
    children: [/* @__PURE__ */ jsxs("svg", {
      className: "absolute top-0 left-0 w-full h-full",
      viewBox: "0 0 1000 1000",
      xmlns: "http://www.w3.org/2000/svg",
      children: [/* @__PURE__ */ jsx("path", {
        d: "M100,100 L300,150 L500,50 L700,200",
        stroke: "#FF5733",
        strokeWidth: "4",
        strokeLinecap: "round",
        opacity: "0.6",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M800,900 L600,800 L400,950 L200,700",
        stroke: "#00C4CC",
        strokeWidth: "6",
        strokeLinecap: "round",
        opacity: "0.4",
        fill: "none"
      }), /* @__PURE__ */ jsx("path", {
        d: "M900,300 L750,350 L800,500 L650,400",
        stroke: "#FFC107",
        strokeWidth: "5",
        strokeLinecap: "round",
        opacity: "0.5",
        fill: "none"
      }), /* @__PURE__ */ jsx("circle", {
        cx: "150",
        cy: "250",
        r: "40",
        fill: "#FF5733",
        opacity: "0.6"
      }), /* @__PURE__ */ jsx("circle", {
        cx: "850",
        cy: "150",
        r: "60",
        fill: "#00C4CC",
        opacity: "0.3"
      }), /* @__PURE__ */ jsx("circle", {
        cx: "750",
        cy: "750",
        r: "30",
        fill: "#FFC107",
        opacity: "0.7"
      }), /* @__PURE__ */ jsx("circle", {
        cx: "250",
        cy: "650",
        r: "50",
        fill: "#FF5733",
        opacity: "0.5"
      }), /* @__PURE__ */ jsx("polygon", {
        points: "600,300 650,380 550,380",
        fill: "#00C4CC",
        opacity: "0.5"
      }), /* @__PURE__ */ jsx("polygon", {
        points: "350,500 400,600 300,600",
        fill: "#FFC107",
        opacity: "0.6"
      }), /* @__PURE__ */ jsx("polygon", {
        points: "800,600 880,650 850,550",
        fill: "#FF5733",
        opacity: "0.4"
      }), /* @__PURE__ */ jsx("path", {
        d: "M100,400 Q200,350 150,450 T250,500 Q300,550 200,600 Z",
        fill: "#00C4CC",
        opacity: "0.3"
      }), /* @__PURE__ */ jsx("path", {
        d: "M700,350 C750,300 800,400 850,350 S900,450 850,500 Q800,550 750,500 Z",
        fill: "#FFC107",
        opacity: "0.4"
      })]
    }), /* @__PURE__ */ jsx("h1", {
      className: "text-white text-2xl font-semibold z-10 px-6 text-center absolute top-[10%]",
      children: "輕鬆記錄每一次，分帳從此不煩惱"
    }), /* @__PURE__ */ jsxs("div", {
      className: "bg-white rounded-lg shadow-2xl w-full max-w-md mx-auto z-10 p-8",
      children: [error && /* @__PURE__ */ jsx("div", {
        className: "mb-4 p-3 bg-red-100 text-red-700 rounded-lg",
        children: error
      }), /* @__PURE__ */ jsxs(Button, {
        variant: "outline",
        className: "w-full py-6 flex items-center justify-center gap-2 rounded-lg border-gray-300",
        onClick: handleGoogleSignIn,
        disabled: loading,
        children: [/* @__PURE__ */ jsx(GoogleIcon, {}), /* @__PURE__ */ jsx("span", {
          children: loading ? "登入中..." : "使用 Google 帳號登入"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "mt-6 text-center",
        children: /* @__PURE__ */ jsxs("p", {
          className: "text-sm text-gray-500",
          children: ["還沒有帳號？", " ", /* @__PURE__ */ jsx("span", {
            className: "text-[#FF5733] font-semibold hover:underline cursor-pointer",
            children: "註冊"
          })]
        })
      })]
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login,
  meta
}, Symbol.toStringTag, { value: "Module" }));
function Switch({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    SwitchPrimitive.Root,
    {
      "data-slot": "switch",
      className: cn(
        "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        SwitchPrimitive.Thumb,
        {
          "data-slot": "switch-thumb",
          className: cn(
            "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0"
          )
        }
      )
    }
  );
}
const formSchema = z.object({
  username: z.string().min(2, "使用者名稱至少需要 2 個字元"),
  email: z.string().email("請輸入有效的電子郵件地址")
});
const example = withComponentProps(function ExamplePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: ""
    }
  });
  function onSubmit(values) {
    console.log(values);
  }
  return /* @__PURE__ */ jsxs("div", {
    className: "container mx-auto p-8 space-y-8",
    children: [/* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-bold",
        children: "表單範例"
      }), /* @__PURE__ */ jsx(Form, {
        ...form,
        children: /* @__PURE__ */ jsxs("form", {
          onSubmit: form.handleSubmit(onSubmit),
          className: "space-y-4",
          children: [/* @__PURE__ */ jsx(FormField, {
            control: form.control,
            name: "username",
            render: ({
              field
            }) => /* @__PURE__ */ jsxs(FormItem, {
              children: [/* @__PURE__ */ jsx(FormLabel, {
                children: "使用者名稱"
              }), /* @__PURE__ */ jsx(FormControl, {
                children: /* @__PURE__ */ jsx(Input, {
                  placeholder: "輸入使用者名稱",
                  ...field
                })
              }), /* @__PURE__ */ jsx(FormMessage, {})]
            })
          }), /* @__PURE__ */ jsx(FormField, {
            control: form.control,
            name: "email",
            render: ({
              field
            }) => /* @__PURE__ */ jsxs(FormItem, {
              children: [/* @__PURE__ */ jsx(FormLabel, {
                children: "電子郵件"
              }), /* @__PURE__ */ jsx(FormControl, {
                children: /* @__PURE__ */ jsx(Input, {
                  placeholder: "輸入電子郵件",
                  ...field
                })
              }), /* @__PURE__ */ jsx(FormMessage, {})]
            })
          }), /* @__PURE__ */ jsx(Button, {
            type: "submit",
            children: "提交"
          })]
        })
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-bold",
        children: "對話框範例"
      }), /* @__PURE__ */ jsxs(Dialog, {
        open: isOpen,
        onOpenChange: setIsOpen,
        children: [/* @__PURE__ */ jsx(DialogTrigger, {
          asChild: true,
          children: /* @__PURE__ */ jsx(Button, {
            variant: "outline",
            children: "打開對話框"
          })
        }), /* @__PURE__ */ jsxs(DialogContent, {
          className: "sm:max-w-[425px]",
          children: [/* @__PURE__ */ jsx(DialogHeader, {
            children: /* @__PURE__ */ jsx(DialogTitle, {
              children: "對話框標題"
            })
          }), /* @__PURE__ */ jsx("div", {
            className: "py-4",
            children: "這是一個對話框範例，可以放置任何內容。"
          }), /* @__PURE__ */ jsx("div", {
            className: "flex justify-end",
            children: /* @__PURE__ */ jsx(Button, {
              onClick: () => setIsOpen(false),
              children: "關閉"
            })
          })]
        })]
      })]
    }), /* @__PURE__ */ jsxs("section", {
      className: "space-y-4",
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-2xl font-bold",
        children: "開關範例"
      }), /* @__PURE__ */ jsxs("div", {
        className: "flex items-center space-x-2",
        children: [/* @__PURE__ */ jsx(Switch, {
          id: "notifications",
          checked: notificationEnabled,
          onCheckedChange: setNotificationEnabled
        }), /* @__PURE__ */ jsx(Label, {
          htmlFor: "notifications",
          children: notificationEnabled ? "通知已開啟" : "通知已關閉"
        })]
      })]
    })]
  });
});
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: example
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-C8xMWYYn.js", "imports": ["/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/index-mS1oS5JQ.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/root-9xaB_-1j.js", "imports": ["/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/index-mS1oS5JQ.js", "/assets/tslib.es6-CzkUkVFP.js", "/assets/AuthContext-Bn0Z1adA.js", "/assets/firebase-Bx0JQDpA.js"], "css": ["/assets/root-B_ZByFqP.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "components/common/Layout": { "id": "components/common/Layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/Layout-dcLw5_7M.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/Avatar-pZysHyAg.js", "/assets/AuthContext-Bn0Z1adA.js", "/assets/Button-CLiAN9zE.js", "/assets/index-CsJZNCbu.js", "/assets/index-mS1oS5JQ.js", "/assets/firebase-Bx0JQDpA.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/personalDashboard": { "id": "routes/personalDashboard", "parentId": "components/common/Layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/personalDashboard-Dzv8o4d0.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/fetchProtectedData-C0qyAwbs.js", "/assets/Button-CLiAN9zE.js", "/assets/DebtOverview-CwZt5G_C.js", "/assets/Card-BilSgfXT.js", "/assets/createLucideIcon-DnKKZaZZ.js", "/assets/AuthContext-Bn0Z1adA.js", "/assets/firebase-Bx0JQDpA.js", "/assets/axios-CU4pZDwH.js", "/assets/Dialog-CtnV3b_C.js", "/assets/index-Dvq_q091.js", "/assets/index-CsJZNCbu.js", "/assets/index-mS1oS5JQ.js", "/assets/proxy-CGZHFHV7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/createEvent": { "id": "routes/createEvent", "parentId": "components/common/Layout", "path": "createEvent", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/createEvent-DSnjBRDI.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/Button-CLiAN9zE.js", "/assets/Input-Bk2Gwrjr.js", "/assets/fetchProtectedData-C0qyAwbs.js", "/assets/arrow-left-Dx-qscqx.js", "/assets/firebase-Bx0JQDpA.js", "/assets/axios-CU4pZDwH.js", "/assets/createLucideIcon-DnKKZaZZ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/eventDashboard": { "id": "routes/eventDashboard", "parentId": "components/common/Layout", "path": "events/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/eventDashboard-Dp7fz3q_.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/firebase-Bx0JQDpA.js", "/assets/axios-CU4pZDwH.js", "/assets/Button-CLiAN9zE.js", "/assets/Card-BilSgfXT.js", "/assets/Avatar-pZysHyAg.js", "/assets/Dialog-CtnV3b_C.js", "/assets/Input-Bk2Gwrjr.js", "/assets/fetchEventMembers-DaBcvrNz.js", "/assets/AlertDialog-DfAx0KZA.js", "/assets/DebtOverview-CwZt5G_C.js", "/assets/fetchProtectedData-C0qyAwbs.js", "/assets/createLucideIcon-DnKKZaZZ.js", "/assets/auth-TnDMynji.js", "/assets/index-CsJZNCbu.js", "/assets/index-mS1oS5JQ.js", "/assets/index-Dvq_q091.js", "/assets/arrow-left-Dx-qscqx.js", "/assets/proxy-CGZHFHV7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/addExpense": { "id": "routes/addExpense", "parentId": "components/common/Layout", "path": "addExpense/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": true, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/addExpense-PoQFfVWi.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/Input-Bk2Gwrjr.js", "/assets/fetchCategories-sT6-wdCf.js", "/assets/Label-BKnnc2Qa.js", "/assets/Button-CLiAN9zE.js", "/assets/fetchEventMembers-DaBcvrNz.js", "/assets/axios-CU4pZDwH.js", "/assets/firebase-Bx0JQDpA.js", "/assets/auth-TnDMynji.js", "/assets/index-Dvq_q091.js", "/assets/index-CsJZNCbu.js", "/assets/index-mS1oS5JQ.js", "/assets/createLucideIcon-DnKKZaZZ.js", "/assets/arrow-left-Dx-qscqx.js", "/assets/proxy-CGZHFHV7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenseDetail": { "id": "routes/expenseDetail", "parentId": "components/common/Layout", "path": "expenseDetails/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenseDetail-ByCsb3wz.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/firebase-Bx0JQDpA.js", "/assets/axios-CU4pZDwH.js", "/assets/Dialog-CtnV3b_C.js", "/assets/fetchEventMembers-DaBcvrNz.js", "/assets/Card-BilSgfXT.js", "/assets/createLucideIcon-DnKKZaZZ.js", "/assets/Button-CLiAN9zE.js", "/assets/AlertDialog-DfAx0KZA.js", "/assets/Form-DrbnftqY.js", "/assets/Input-Bk2Gwrjr.js", "/assets/Label-BKnnc2Qa.js", "/assets/fetchCategories-sT6-wdCf.js", "/assets/index-Dvq_q091.js", "/assets/index-CsJZNCbu.js", "/assets/index-mS1oS5JQ.js", "/assets/arrow-left-Dx-qscqx.js", "/assets/proxy-CGZHFHV7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-C2-js9mn.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/Button-CLiAN9zE.js", "/assets/AuthContext-Bn0Z1adA.js", "/assets/fetchProtectedData-C0qyAwbs.js", "/assets/firebase-Bx0JQDpA.js", "/assets/axios-CU4pZDwH.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/example": { "id": "routes/example", "parentId": "root", "path": "example", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/example-CTz2_JCW.js", "imports": ["/assets/tslib.es6-CzkUkVFP.js", "/assets/chunk-BAXFHI7N-CdrFtp8d.js", "/assets/Form-DrbnftqY.js", "/assets/Button-CLiAN9zE.js", "/assets/Dialog-CtnV3b_C.js", "/assets/Input-Bk2Gwrjr.js", "/assets/Label-BKnnc2Qa.js", "/assets/index-Dvq_q091.js", "/assets/index-CsJZNCbu.js", "/assets/createLucideIcon-DnKKZaZZ.js", "/assets/index-mS1oS5JQ.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-60aa1e57.js", "version": "60aa1e57", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "components/common/Layout": {
    id: "components/common/Layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/personalDashboard": {
    id: "routes/personalDashboard",
    parentId: "components/common/Layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/createEvent": {
    id: "routes/createEvent",
    parentId: "components/common/Layout",
    path: "createEvent",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/eventDashboard": {
    id: "routes/eventDashboard",
    parentId: "components/common/Layout",
    path: "events/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/addExpense": {
    id: "routes/addExpense",
    parentId: "components/common/Layout",
    path: "addExpense/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/expenseDetail": {
    id: "routes/expenseDetail",
    parentId: "components/common/Layout",
    path: "expenseDetails/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/example": {
    id: "routes/example",
    parentId: "root",
    path: "example",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
