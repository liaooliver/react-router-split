import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse, NavLink, Link, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import * as React from "react";
import { createElement, useState, useMemo, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { XIcon, Plus, ArrowLeft, Trash2, Pencil, CircleIcon, ChevronDownIcon, CheckIcon, ChevronUpIcon, CheckCircle2, User, Info } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as AvatarPrimitive from "@radix-ui/react-avatar";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as SelectPrimitive from "@radix-ui/react-select";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
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
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout$1({
  children
}) {
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
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout: Layout$1,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const appDesignTokens = {
  primary: "#FF5733",
  secondary: "#00C4CC",
  accent: "#FFC107"
};
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
const Navbar = ({ iconType = "coin" }) => /* @__PURE__ */ jsx("nav", { className: "p-4 sticky top-0 z-20 bg-primary text-primary-foreground", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto flex justify-between items-center", children: [
  /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
    /* @__PURE__ */ jsx(CoinIcon, {}),
    /* @__PURE__ */ jsx("h1", { className: "text-xl", children: "活潑分帳" })
  ] }),
  /* @__PURE__ */ jsxs("div", { className: "space-x-4", children: [
    /* @__PURE__ */ jsx(
      NavLink,
      {
        to: "/",
        className: "px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
        children: "首頁"
      }
    ),
    /* @__PURE__ */ jsx(
      NavLink,
      {
        to: "/dashboard",
        className: "px-4 py-2 rounded-md hover:bg-accent hover:text-accent-foreground",
        children: "總覽"
      }
    )
  ] })
] }) });
const GradientBackground = () => /* @__PURE__ */ jsxs("div", {
  className: "absolute top-0 left-0 w-full h-full z-0",
  children: [/* @__PURE__ */ jsx("div", {
    className: "w-full h-full bg-gradient-custom"
  }), /* @__PURE__ */ jsxs("svg", {
    className: "absolute top-0 left-0 w-full h-full opacity-20",
    viewBox: "0 0 100 100",
    preserveAspectRatio: "xMidYMid slice",
    children: [/* @__PURE__ */ jsx("circle", {
      cx: "50",
      cy: "50",
      r: "2.5",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "30",
      cy: "50",
      r: "1.5",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "10",
      cy: "50",
      r: "1",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "20",
      cy: "30",
      r: "1.2",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "15",
      cy: "70",
      r: "0.8",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "70",
      cy: "50",
      r: "1.5",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "90",
      cy: "50",
      r: "1",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "80",
      cy: "30",
      r: "1.2",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "85",
      cy: "70",
      r: "0.8",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "50",
      cy: "20",
      r: "1.8",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "30",
      cy: "25",
      r: "1.2",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "70",
      cy: "25",
      r: "1.2",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "40",
      cy: "15",
      r: "0.9",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "60",
      cy: "15",
      r: "0.9",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "50",
      cy: "80",
      r: "1.8",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "30",
      cy: "75",
      r: "1.2",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "70",
      cy: "75",
      r: "1.2",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "40",
      cy: "85",
      r: "0.9",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "60",
      cy: "85",
      r: "0.9",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("path", {
      d: "M20,50 Q35,50 40,50",
      stroke: appDesignTokens.secondary,
      strokeWidth: "0.2",
      fill: "none"
    }), /* @__PURE__ */ jsx("path", {
      d: "M60,50 Q75,50 80,50",
      stroke: appDesignTokens.accent,
      strokeWidth: "0.2",
      fill: "none"
    }), /* @__PURE__ */ jsx("path", {
      d: "M50,30 Q50,40 50,45",
      stroke: appDesignTokens.primary,
      strokeWidth: "0.2",
      fill: "none"
    }), /* @__PURE__ */ jsx("path", {
      d: "M50,55 Q50,65 50,70",
      stroke: appDesignTokens.accent,
      strokeWidth: "0.2",
      fill: "none"
    }), /* @__PURE__ */ jsx("circle", {
      cx: "25",
      cy: "35",
      r: "0.4",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "75",
      cy: "35",
      r: "0.4",
      fill: appDesignTokens.secondary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "25",
      cy: "65",
      r: "0.4",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "75",
      cy: "65",
      r: "0.4",
      fill: appDesignTokens.primary
    }), /* @__PURE__ */ jsx("circle", {
      cx: "45",
      cy: "25",
      r: "0.4",
      fill: appDesignTokens.accent
    }), /* @__PURE__ */ jsx("circle", {
      cx: "55",
      cy: "75",
      r: "0.4",
      fill: appDesignTokens.secondary
    })]
  })]
});
const Layout = () => /* @__PURE__ */ jsxs("div", {
  className: "min-h-screen font-sans relative overflow-hidden",
  children: [/* @__PURE__ */ jsx(GradientBackground, {}), /* @__PURE__ */ jsx(Navbar, {
    iconType: "coin"
  }), /* @__PURE__ */ jsx("main", {
    className: "w-full max-w-mobile md:max-w-tablet lg:max-w-desktop mx-auto p-4 z-10 relative",
    children: /* @__PURE__ */ jsx(Outlet, {})
  })]
});
const layout = withComponentProps(Layout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: layout
}, Symbol.toStringTag, { value: "Module" }));
function cn(...inputs) {
  return twMerge(clsx(inputs));
}
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
function meta$1({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx("h1", {
      className: "text-black",
      children: "Home Page"
    }), /* @__PURE__ */ jsx("div", {
      className: "w-full h-5 bg-amber-600"
    })]
  });
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
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
const DebtOverview = ({ debts, onMarkPaid }) => {
  var _a, _b, _c, _d;
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    debtId: null
  });
  const handleMarkPaid = (id) => {
    setConfirmDialog({ isOpen: true, debtId: id });
  };
  const handleConfirmPayment = () => {
    if (confirmDialog.debtId) {
      onMarkPaid(confirmDialog.debtId);
    }
    setConfirmDialog({ isOpen: false, debtId: null });
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsx("h2", { className: "text-md font-medium text-[#263238] mb-3", children: "分帳關係" }),
      /* @__PURE__ */ jsx("div", { className: "space-y-2", children: /* @__PURE__ */ jsx(AnimatePresence, { children: debts.length > 0 ? debts.map((d) => /* @__PURE__ */ jsx(
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
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#263238]", children: d.from })
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
                /* @__PURE__ */ jsx("span", { className: "text-sm text-[#263238]", children: d.to })
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "flex items-center justify-between", children: [
              /* @__PURE__ */ jsxs("span", { className: "text-xs text-gray-400", children: [
                "（來自 ",
                d.event,
                "）"
              ] }),
              /* @__PURE__ */ jsx(
                Button,
                {
                  className: "w-[72px] h-[28px] text-xs bg-[#00C4CC] text-white rounded",
                  onClick: () => handleMarkPaid(d.id),
                  children: "標記已付"
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
                  (_a = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _a.from
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "收款人：",
                  (_b = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _b.to
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "金額：$",
                  (_c = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _c.amount
                ] }),
                /* @__PURE__ */ jsxs("p", { children: [
                  "來自：",
                  (_d = debts.find((d) => d.id === confirmDialog.debtId)) == null ? void 0 : _d.event
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
var EventStatus = /* @__PURE__ */ ((EventStatus2) => {
  EventStatus2["ACTIVE"] = "active";
  EventStatus2["PENDING"] = "pending";
  EventStatus2["ARCHIVED"] = "archived";
  return EventStatus2;
})(EventStatus || {});
const StatusStyle = {
  [
    "active"
    /* ACTIVE */
  ]: "bg-green-500 text-white",
  [
    "pending"
    /* PENDING */
  ]: "bg-yellow-400 text-gray-800",
  [
    "archived"
    /* ARCHIVED */
  ]: "bg-gray-400 text-white"
};
const StatusLabel = {
  [
    "active"
    /* ACTIVE */
  ]: "活躍",
  [
    "pending"
    /* PENDING */
  ]: "待結算",
  [
    "archived"
    /* ARCHIVED */
  ]: "已封存"
};
const StatusBadge = ({ status }) => {
  const getStatusStyle = (status2) => {
    return StatusStyle[status2] || "bg-gray-300 text-gray-800";
  };
  const translateStatus = (status2) => {
    return StatusLabel[status2] || status2;
  };
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusStyle(
        status
      )}`,
      children: translateStatus(status)
    }
  );
};
const EventList = ({ events }) => {
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx("h2", { className: "text-md font-medium text-[#263238] mb-2", children: "所有事件" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-4 max-h-[200px] overflow-y-auto pr-2", children: events.map((e) => /* @__PURE__ */ jsx(Link, { className: "block", to: `/events/${e.id}`, children: /* @__PURE__ */ jsx(Card, { className: "p-4", children: /* @__PURE__ */ jsxs(CardContent, { className: "p-0", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-[#263238] font-semibold text-sm", children: e.name }),
        /* @__PURE__ */ jsx(StatusBadge, { status: e.status })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "mt-2 text-sm text-[#71717A]", children: [
        "淨餘額：",
        /* @__PURE__ */ jsxs(
          "span",
          {
            className: `${e.balance >= 0 ? "text-[#10B981]" : "text-[#EF4444]"}`,
            children: [
              "$",
              e.balance
            ]
          }
        )
      ] })
    ] }) }) }, e.id)) })
  ] });
};
const PersonalDashboard = () => {
  const [debts, setDebts] = useState([{
    id: 1,
    from: "小智",
    to: "小明",
    amount: 266.67,
    event: "晚餐聚會",
    paid: false
  }, {
    id: 2,
    from: "小花",
    to: "小華",
    amount: 150,
    event: "電影日",
    paid: false
  }]);
  const events = [{
    id: 1,
    name: "露營團",
    status: EventStatus.ACTIVE,
    balance: -200
  }, {
    id: 2,
    name: "桌遊之夜",
    status: EventStatus.PENDING,
    balance: 150
  }, {
    id: 3,
    name: "烤肉派對",
    status: EventStatus.ACTIVE,
    balance: 300
  }, {
    id: 4,
    name: "生日聚會",
    status: EventStatus.ARCHIVED,
    balance: -150
  }, {
    id: 5,
    name: "電影馬拉松",
    status: EventStatus.PENDING,
    balance: 180
  }];
  const handleMarkPaid = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };
  return /* @__PURE__ */ jsxs("div", {
    className: "max-w-md mx-auto p-4 space-y-6",
    children: [/* @__PURE__ */ jsx("header", {
      className: "text-center text-[24px] font-semibold text-[#263238] py-4",
      children: "我的帳本"
    }), /* @__PURE__ */ jsxs("div", {
      className: "flex justify-between text-center",
      children: [/* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-[#71717A]",
          children: "總欠款"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-[20px] font-semibold text-[#EF4444]",
          children: "$1200.00"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        children: [/* @__PURE__ */ jsx("p", {
          className: "text-sm text-[#71717A]",
          children: "總應得"
        }), /* @__PURE__ */ jsx("p", {
          className: "text-[20px] font-semibold text-[#10B981]",
          children: "$800.00"
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-md font-medium text-[#263238] mb-2",
        children: "最近 2 個活躍事件"
      }), /* @__PURE__ */ jsx("div", {
        className: "flex space-x-4",
        children: ["週末聚餐", "三天兩夜小旅行"].map((title, i) => /* @__PURE__ */ jsx(Card, {
          className: " rounded-lg p-4 w-[160px]",
          children: /* @__PURE__ */ jsxs(CardContent, {
            className: "p-0",
            children: [/* @__PURE__ */ jsx("p", {
              className: " font-semibold text-sm",
              children: title
            }), /* @__PURE__ */ jsx("p", {
              className: " text-xs",
              children: "5 位參與人"
            })]
          })
        }, i))
      })]
    }), /* @__PURE__ */ jsx(EventList, {
      events
    }), /* @__PURE__ */ jsx(DebtOverview, {
      debts,
      onMarkPaid: handleMarkPaid
    }), /* @__PURE__ */ jsx("div", {
      className: "text-right",
      children: /* @__PURE__ */ jsx("a", {
        href: "/debtRelationship",
        className: "text-sm text-[#00C4CC] font-medium",
        children: "查看更多 →"
      })
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
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: personalDashboard
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
const mockCreateEvent = async (eventName) => {
  await new Promise((resolve) => setTimeout(resolve, 1e3));
  return {
    id: Math.floor(Math.random() * 1e3) + 1,
    // 隨機產生 ID
    name: eventName
  };
};
const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newEvent = await mockCreateEvent(eventName);
      navigate(`/events/${newEvent.id}`);
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
        to: "/dashboard",
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
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: createEvent
}, Symbol.toStringTag, { value: "Module" }));
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
function ScrollArea({
  className,
  children,
  ...props
}) {
  return /* @__PURE__ */ jsxs(
    ScrollAreaPrimitive.Root,
    {
      "data-slot": "scroll-area",
      className: cn("relative", className),
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          ScrollAreaPrimitive.Viewport,
          {
            "data-slot": "scroll-area-viewport",
            className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1",
            children
          }
        ),
        /* @__PURE__ */ jsx(ScrollBar, {}),
        /* @__PURE__ */ jsx(ScrollAreaPrimitive.Corner, {})
      ]
    }
  );
}
function ScrollBar({
  className,
  orientation = "vertical",
  ...props
}) {
  return /* @__PURE__ */ jsx(
    ScrollAreaPrimitive.ScrollAreaScrollbar,
    {
      "data-slot": "scroll-area-scrollbar",
      orientation,
      className: cn(
        "flex touch-none p-px transition-colors select-none",
        orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
        orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        ScrollAreaPrimitive.ScrollAreaThumb,
        {
          "data-slot": "scroll-area-thumb",
          className: "bg-border relative flex-1 rounded-full"
        }
      )
    }
  );
}
const PageHeader = ({ title, onBack }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (onBack) {
      onBack();
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
const mockEvent = {
  eventId: "20200101",
  title: "週末烤肉聚會",
  status: "unsettled",
  members: [{
    id: 1,
    name: "小美",
    avatar: "https://i.pravatar.cc/100?u=1"
  }, {
    id: 2,
    name: "阿宏",
    avatar: "https://i.pravatar.cc/100?u=2"
  }, {
    id: 3,
    name: "志明",
    avatar: "https://i.pravatar.cc/100?u=3"
  }],
  balances: [{
    userId: 1,
    name: "小美",
    amount: 120
  }, {
    userId: 2,
    name: "阿宏",
    amount: -60
  }, {
    userId: 3,
    name: "志明",
    amount: -60
  }],
  expenses: [{
    id: 101,
    title: "肉品食材",
    amount: 180
  }, {
    id: 102,
    title: "飲料啤酒",
    amount: 60
  }]
};
const RenderMemberList = ({
  event,
  onAddMember
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");
  const handleSubmit = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName("");
      setIsOpen(false);
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, {
    children: [/* @__PURE__ */ jsx(ScrollArea, {
      className: "flex max-w-md mx-auto p-4 space-y-6",
      children: /* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-4",
        children: [/* @__PURE__ */ jsxs("div", {
          className: "flex flex-col items-center cursor-pointer",
          onClick: () => setIsOpen(true),
          children: [/* @__PURE__ */ jsx(Avatar, {
            className: "w-10 h-10 bg-[#00C4CC]",
            children: /* @__PURE__ */ jsx(Plus, {
              className: "w-5 h-5 text-white"
            })
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs text-[#263238] mt-1",
            children: "新增"
          })]
        }), event.members.map((member) => /* @__PURE__ */ jsxs("div", {
          className: "relative flex flex-col items-center",
          children: [/* @__PURE__ */ jsxs(Avatar, {
            className: "w-10 h-10 bg-[#E5E7EB]",
            children: [/* @__PURE__ */ jsx(AvatarImage, {
              src: member.avatar,
              alt: member.name
            }), /* @__PURE__ */ jsx(AvatarFallback, {
              children: member.name.charAt(0)
            })]
          }), /* @__PURE__ */ jsx("span", {
            className: "text-xs text-[#263238] mt-1",
            children: member.name
          }), /* @__PURE__ */ jsx("button", {
            className: "absolute -top-1 -right-1 bg-white rounded-full p-0.5",
            children: /* @__PURE__ */ jsx(Trash2, {
              className: "w-3 h-3 text-red-500"
            })
          })]
        }, member.id))]
      })
    }), /* @__PURE__ */ jsx(Dialog, {
      open: isOpen,
      onOpenChange: setIsOpen,
      children: /* @__PURE__ */ jsxs(DialogContent, {
        className: "sm:max-w-[425px] bg-card text-card-foreground border border-border",
        children: [/* @__PURE__ */ jsx(DialogHeader, {
          children: /* @__PURE__ */ jsx(DialogTitle, {
            className: "text-card-foreground",
            children: "新增成員"
          })
        }), /* @__PURE__ */ jsx("div", {
          className: "grid gap-4 py-4",
          children: /* @__PURE__ */ jsx("div", {
            className: "grid grid-cols-4 items-center gap-4",
            children: /* @__PURE__ */ jsx(Input, {
              id: "name",
              placeholder: "請輸入成員名稱",
              className: "col-span-4 border-input",
              value: newMemberName,
              onChange: (e) => setNewMemberName(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }
            })
          })
        }), /* @__PURE__ */ jsxs(DialogFooter, {
          className: "gap-2",
          children: [/* @__PURE__ */ jsx(Button, {
            variant: "outline",
            onClick: () => setIsOpen(false),
            className: "w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90",
            children: "取消"
          }), /* @__PURE__ */ jsx(Button, {
            className: "w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90",
            onClick: handleSubmit,
            disabled: !newMemberName.trim(),
            children: "新增"
          })]
        })]
      })
    })]
  });
};
const RenderBalanceOverview = ({
  event
}) => /* @__PURE__ */ jsx("div", {
  className: "space-y-2",
  children: event.balances.map((b) => /* @__PURE__ */ jsx(Card, {
    className: "w-full h-14 border border-[#D1D5DB] rounded-lg",
    children: /* @__PURE__ */ jsxs(CardContent, {
      className: "flex items-center justify-between h-full px-4",
      children: [/* @__PURE__ */ jsx("span", {
        className: "text-sm text-[#263238]",
        children: b.name
      }), /* @__PURE__ */ jsxs("span", {
        className: `text-sm font-medium ${b.amount >= 0 ? "text-green-500" : "text-red-500"}`,
        children: [b.amount >= 0 ? "+" : "-", "$", Math.abs(b.amount).toFixed(2)]
      })]
    })
  }, b.userId))
});
const RenderExpenseList = ({
  isSettled,
  event
}) => {
  if (isSettled) return null;
  if (event.expenses.length === 0) {
    return /* @__PURE__ */ jsx("div", {
      className: "text-sm text-center text-gray-400",
      children: "目前無費用記錄"
    });
  }
  return /* @__PURE__ */ jsx("div", {
    className: "space-y-2",
    children: event.expenses.map((exp) => /* @__PURE__ */ jsx(Card, {
      className: "w-full h-14 border border-[#D1D5DB] rounded-lg",
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "flex items-center justify-between h-full px-4",
        children: [/* @__PURE__ */ jsx("div", {
          children: /* @__PURE__ */ jsxs("p", {
            className: "text-sm text-[#263238]",
            children: [exp.title, " - $", exp.amount]
          })
        }), /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-2",
          children: [/* @__PURE__ */ jsx(Link, {
            to: {
              pathname: `/expenseDetails/${exp.id}`
            },
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
            children: /* @__PURE__ */ jsx(Trash2, {
              className: "w-4 h-4 text-red-500"
            })
          })]
        })]
      })
    }, exp.id))
  });
};
const eventDashboard = withComponentProps(function EventDashboard() {
  const [event, setEvent] = useState(mockEvent);
  const isSettled = event.status === "settled";
  const handleAddMember = (name) => {
    const newMember = {
      id: Math.max(...event.members.map((m) => m.id)) + 1,
      name,
      avatar: `https://i.pravatar.cc/100?u=${Date.now()}`
    };
    const newBalance = {
      userId: newMember.id,
      name,
      amount: 0
    };
    setEvent((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      balances: [...prev.balances, newBalance]
    }));
  };
  return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: event.title
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-base font-medium text-[#263238] mb-2",
        children: "成員"
      }), /* @__PURE__ */ jsx(RenderMemberList, {
        event,
        onAddMember: handleAddMember
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("h2", {
        className: "text-base font-medium text-[#263238] mb-2",
        children: "餘額概覽"
      }), /* @__PURE__ */ jsx(RenderBalanceOverview, {
        event
      })]
    }), !isSettled && /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex justify-between items-center mb-2",
        children: [/* @__PURE__ */ jsx("h2", {
          className: "text-base font-medium text-[#263238]",
          children: "費用列表"
        }), /* @__PURE__ */ jsx(Link, {
          to: {
            pathname: "/addExpense",
            search: `?event=${event.eventId}`
          },
          children: /* @__PURE__ */ jsx(Button, {
            className: "bg-[#00C4CC] text-white cursor-pointer rounded px-3 h-9",
            children: "新增費用"
          })
        })]
      }), /* @__PURE__ */ jsx(RenderExpenseList, {
        event,
        isSettled
      })]
    }), !isSettled && /* @__PURE__ */ jsx("div", {
      className: "text-center",
      children: /* @__PURE__ */ jsx(Button, {
        className: "w-full bg-[#FF5733] cursor-pointer text-white rounded h-10",
        children: "結算"
      })
    })]
  });
});
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
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
function AddExpense() {
  const {
    id: eventId
  } = useParams();
  const navigate = useNavigate();
  const mockMembers = useMemo(() => ["小美", "阿成", "曉明"], []);
  const [members, setMembers] = useState([]);
  const [form, setForm] = useState({
    description: "",
    total: "",
    payers: {},
    splitType: "even",
    shares: {},
    note: "",
    category: ""
  });
  const [error, setError] = useState("");
  useEffect(() => {
    const fakeMembers = mockMembers;
    setMembers(fakeMembers);
    setForm((prev) => ({
      ...prev,
      payers: fakeMembers.reduce((acc, member) => ({
        ...acc,
        [member]: 0
      }), {}),
      shares: fakeMembers.reduce((acc, member) => ({
        ...acc,
        [member]: 0
      }), {})
    }));
  }, [mockMembers]);
  const handleSave = async () => {
    if (!form.description || !form.total) {
      setError("描述與總額為必填");
      return;
    }
    const totalPaid = Object.values(form.payers).reduce((sum, amount) => sum + Number(amount), 0);
    const totalShared = Object.values(form.shares).reduce((sum, amount) => sum + Number(amount), 0);
    if (totalPaid !== Number(form.total) || totalShared !== Number(form.total)) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }
    const payload = {
      event_id: eventId,
      description: form.description,
      total: Number(form.total),
      payers: Object.entries(form.payers).map(([member, amount]) => ({
        member_name: member,
        amount
      })),
      shares: Object.entries(form.shares).map(([member, amount]) => ({
        member_name: member,
        amount
      })),
      note: form.note || null,
      category: form.category || null
    };
    console.log("📝 模擬儲存資料:", payload);
    navigate(`/events/${eventId}`);
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
              className: "w-20 h-8 border-[#D1D5DB] rounded-md bg-white"
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
              className: "w-20 h-8 border-[#D1D5DB] rounded-md"
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
          children: [/* @__PURE__ */ jsx(SelectTrigger, {
            className: "mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black",
            children: /* @__PURE__ */ jsx(SelectValue, {
              placeholder: "選擇類別"
            })
          }), /* @__PURE__ */ jsxs(SelectContent, {
            children: [/* @__PURE__ */ jsx(SelectItem, {
              value: "餐費",
              children: "餐費"
            }), /* @__PURE__ */ jsx(SelectItem, {
              value: "交通",
              children: "交通"
            }), /* @__PURE__ */ jsx(SelectItem, {
              value: "住宿",
              children: "住宿"
            })]
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
const route6 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: addExpense
}, Symbol.toStringTag, { value: "Module" }));
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
const expenseDetail = withComponentProps(function ExpenseDetails() {
  const [isSettled, setIsSettled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleEdit = () => {
    console.log("導向編輯頁面...");
  };
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };
  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    console.log("刪除成功");
  };
  const toggleSettle = () => {
    setIsSettled((prev) => !prev);
  };
  return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: "費用詳情"
    }), /* @__PURE__ */ jsx(Card, {
      children: /* @__PURE__ */ jsxs(CardContent, {
        className: "space-y-1 pt-4",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-base font-semibold text-gray-800",
          children: "與朋友的晚餐"
        }), /* @__PURE__ */ jsx("div", {
          className: "text-2xl font-bold text-gray-800",
          children: "$50.00"
        }), /* @__PURE__ */ jsx("div", {
          className: "text-sm text-gray-500",
          children: "2023年10月26日 晚上8:30"
        }), !isSettled && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-1 text-orange-700 text-sm pt-2",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "w-4 h-4"
          }), /* @__PURE__ */ jsx("span", {
            children: "尚未結算"
          })]
        }), isSettled && /* @__PURE__ */ jsxs("div", {
          className: "flex items-center gap-1 text-green-600 text-sm pt-2",
          children: [/* @__PURE__ */ jsx(CheckCircle2, {
            className: "w-4 h-4"
          }), /* @__PURE__ */ jsx("span", {
            children: "已結算"
          })]
        })]
      })
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1 text-sm font-medium text-gray-800",
        children: [/* @__PURE__ */ jsx(User, {
          className: "w-4 h-4"
        }), /* @__PURE__ */ jsx("span", {
          children: "付款人"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "pl-2 pt-2 space-y-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-gray-700",
          children: "小明：$30.00"
        }), /* @__PURE__ */ jsx("div", {
          className: "text-gray-700",
          children: "小美：$20.00"
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1 text-sm font-medium text-gray-800",
        children: [/* @__PURE__ */ jsx(Info, {
          className: "w-4 h-4"
        }), /* @__PURE__ */ jsx("span", {
          children: "分攤方式"
        })]
      }), /* @__PURE__ */ jsx("div", {
        className: "pl-2 pt-2 text-gray-700",
        children: "平均分攤"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsxs("div", {
        className: "flex items-center gap-1 text-sm font-medium text-gray-800",
        children: [/* @__PURE__ */ jsx(User, {
          className: "w-4 h-4"
        }), /* @__PURE__ */ jsx("span", {
          children: "分攤金額"
        })]
      }), /* @__PURE__ */ jsxs("div", {
        className: "pl-2 pt-2 space-y-2",
        children: [/* @__PURE__ */ jsx("div", {
          className: "text-gray-700",
          children: "小明：$25.00"
        }), /* @__PURE__ */ jsx("div", {
          className: "text-gray-700",
          children: "小美：$25.00"
        })]
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "text-sm font-medium text-gray-800",
        children: "備註"
      }), /* @__PURE__ */ jsx("div", {
        className: "pl-2 pt-2 text-gray-700",
        children: "今天小明請客 XD"
      })]
    }), /* @__PURE__ */ jsxs("div", {
      children: [/* @__PURE__ */ jsx("div", {
        className: "text-sm font-medium text-gray-800",
        children: "類別"
      }), /* @__PURE__ */ jsx("div", {
        className: "pl-2 pt-2 text-gray-700",
        children: "餐飲"
      })]
    }), /* @__PURE__ */ jsx("div", {
      className: "pt-2 text-right",
      children: /* @__PURE__ */ jsx(Button, {
        variant: "outline",
        className: "text-sm",
        onClick: toggleSettle,
        children: isSettled ? "標記為未結算" : "標記為已結算"
      })
    }), !isSettled && /* @__PURE__ */ jsxs("div", {
      className: "flex justify-between pt-4",
      children: [/* @__PURE__ */ jsxs(Button, {
        onClick: handleEdit,
        className: "bg-[#FFC107] text-white hover:bg-yellow-500",
        children: [/* @__PURE__ */ jsx(Pencil, {
          className: "mr-2 h-4 w-4"
        }), " 編輯"]
      }), /* @__PURE__ */ jsxs(AlertDialog, {
        open: showDeleteConfirm,
        onOpenChange: setShowDeleteConfirm,
        children: [/* @__PURE__ */ jsx(AlertDialogTrigger, {
          asChild: true,
          children: /* @__PURE__ */ jsxs(Button, {
            onClick: handleDelete,
            className: "bg-red-500 text-white hover:bg-red-600",
            children: [/* @__PURE__ */ jsx(Trash2, {
              className: "mr-2 h-4 w-4"
            }), " 刪除"]
          })
        }), /* @__PURE__ */ jsxs(AlertDialogContent, {
          children: [/* @__PURE__ */ jsx(AlertDialogHeader, {
            children: "確定要刪除這筆費用嗎？"
          }), /* @__PURE__ */ jsxs(AlertDialogFooter, {
            children: [/* @__PURE__ */ jsx(Button, {
              variant: "outline",
              onClick: () => setShowDeleteConfirm(false),
              children: "取消"
            }), /* @__PURE__ */ jsx(Button, {
              className: "bg-red-500 text-white",
              onClick: confirmDelete,
              children: "確定刪除"
            })]
          })]
        })]
      })]
    })]
  });
});
const route7 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: expenseDetail
}, Symbol.toStringTag, { value: "Module" }));
const DebtRelationshipPage = () => {
  const [debts, setDebts] = useState([{
    id: 1,
    from: "小智",
    to: "小明",
    amount: 266.67,
    event: "晚餐聚會",
    paid: false
  }, {
    id: 2,
    from: "小花",
    to: "小華",
    amount: 150,
    event: "電影日",
    paid: false
  }]);
  const handleMarkPaid = (id) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };
  return /* @__PURE__ */ jsxs(AnimatedPageContainer, {
    children: [/* @__PURE__ */ jsx(PageHeader, {
      title: "分帳關係"
    }), /* @__PURE__ */ jsx(DebtOverview, {
      debts,
      onMarkPaid: handleMarkPaid
    })]
  });
};
const debtRelationship = withComponentProps(DebtRelationshipPage);
const route8 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: debtRelationship
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
  const [useEmail, setUseEmail] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
      children: [/* @__PURE__ */ jsx(Link, {
        to: {
          pathname: "/dashboard"
        },
        children: /* @__PURE__ */ jsxs(Button, {
          variant: "outline",
          className: "w-full py-6 flex items-center justify-center gap-2 rounded-lg border-gray-300 ",
          children: [/* @__PURE__ */ jsx(GoogleIcon, {}), /* @__PURE__ */ jsx("span", {
            children: "使用 Google 帳號登入"
          })]
        })
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
const route9 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: login,
  meta
}, Symbol.toStringTag, { value: "Module" }));
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
const route10 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: example
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-7c0xsGrn.js", "imports": ["/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/index-D6UMYnyY.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/assets/root-Z0pkXQP4.js", "imports": ["/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/index-D6UMYnyY.js", "/assets/with-props-B2Htt2Hn.js"], "css": ["/assets/root-BlhXY3ex.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "components/common/layout": { "id": "components/common/layout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/layout-qMsLKV8O.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "components/common/layout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/home-CHOe9EDM.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/personalDashboard": { "id": "routes/personalDashboard", "parentId": "components/common/layout", "path": "dashboard", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/personalDashboard-B2FJYiGr.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/card-DV3dFTMn.js", "/assets/button-BVG67S5E.js", "/assets/debtOverview-BsaYVwbq.js", "/assets/plus-duRAOoAI.js", "/assets/dialog-bh4Rpo9L.js", "/assets/index-U5F_jkt5.js", "/assets/index-ClNy2XSY.js", "/assets/index-D6UMYnyY.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/proxy-DKvFvltC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/createEvent": { "id": "routes/createEvent", "parentId": "components/common/layout", "path": "createEvent", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/createEvent-CA2lY-gu.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/button-BVG67S5E.js", "/assets/input-Cugxmh2B.js", "/assets/arrow-left-DnYMBiHR.js", "/assets/createLucideIcon-CuW0LreG.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/eventDashboard": { "id": "routes/eventDashboard", "parentId": "components/common/layout", "path": "events/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/eventDashboard-BYGNQklf.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/button-BVG67S5E.js", "/assets/card-DV3dFTMn.js", "/assets/index-ClNy2XSY.js", "/assets/index-GRCbIDdf.js", "/assets/dialog-bh4Rpo9L.js", "/assets/input-Cugxmh2B.js", "/assets/AnimatedPageContainer-D9iUIbLG.js", "/assets/plus-duRAOoAI.js", "/assets/trash-2-VUc5L9ge.js", "/assets/index-D6UMYnyY.js", "/assets/index-U5F_jkt5.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/arrow-left-DnYMBiHR.js", "/assets/proxy-DKvFvltC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/addExpense": { "id": "routes/addExpense", "parentId": "components/common/layout", "path": "addExpense", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/addExpense-CeKOSwth.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/input-Cugxmh2B.js", "/assets/index-ClNy2XSY.js", "/assets/button-BVG67S5E.js", "/assets/index-GRCbIDdf.js", "/assets/label-CGrjsDfX.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/index-D6UMYnyY.js", "/assets/AnimatedPageContainer-D9iUIbLG.js", "/assets/arrow-left-DnYMBiHR.js", "/assets/proxy-DKvFvltC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/expenseDetail": { "id": "routes/expenseDetail", "parentId": "components/common/layout", "path": "expenseDetails/:id", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/expenseDetail-bQJshOjG.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/button-BVG67S5E.js", "/assets/card-DV3dFTMn.js", "/assets/index-ClNy2XSY.js", "/assets/index-U5F_jkt5.js", "/assets/AnimatedPageContainer-D9iUIbLG.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/trash-2-VUc5L9ge.js", "/assets/index-D6UMYnyY.js", "/assets/arrow-left-DnYMBiHR.js", "/assets/proxy-DKvFvltC.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/debtRelationship": { "id": "routes/debtRelationship", "parentId": "components/common/layout", "path": "debtRelationship", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/debtRelationship-Bfarq6ai.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/AnimatedPageContainer-D9iUIbLG.js", "/assets/debtOverview-BsaYVwbq.js", "/assets/arrow-left-DnYMBiHR.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/proxy-DKvFvltC.js", "/assets/button-BVG67S5E.js", "/assets/dialog-bh4Rpo9L.js", "/assets/index-U5F_jkt5.js", "/assets/index-ClNy2XSY.js", "/assets/index-D6UMYnyY.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/login": { "id": "routes/login", "parentId": "root", "path": "login", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/login-IYi53dvu.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/button-BVG67S5E.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/example": { "id": "routes/example", "parentId": "root", "path": "example", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/assets/example-DF1tEZ_3.js", "imports": ["/assets/with-props-B2Htt2Hn.js", "/assets/chunk-KNED5TY2-aB5C0GE7.js", "/assets/button-BVG67S5E.js", "/assets/dialog-bh4Rpo9L.js", "/assets/label-CGrjsDfX.js", "/assets/input-Cugxmh2B.js", "/assets/index-ClNy2XSY.js", "/assets/index-U5F_jkt5.js", "/assets/createLucideIcon-CuW0LreG.js", "/assets/index-D6UMYnyY.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/assets/manifest-6af787d9.js", "version": "6af787d9", "sri": void 0 };
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
  "components/common/layout": {
    id: "components/common/layout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/home": {
    id: "routes/home",
    parentId: "components/common/layout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/personalDashboard": {
    id: "routes/personalDashboard",
    parentId: "components/common/layout",
    path: "dashboard",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/createEvent": {
    id: "routes/createEvent",
    parentId: "components/common/layout",
    path: "createEvent",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/eventDashboard": {
    id: "routes/eventDashboard",
    parentId: "components/common/layout",
    path: "events/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route5
  },
  "routes/addExpense": {
    id: "routes/addExpense",
    parentId: "components/common/layout",
    path: "addExpense",
    index: void 0,
    caseSensitive: void 0,
    module: route6
  },
  "routes/expenseDetail": {
    id: "routes/expenseDetail",
    parentId: "components/common/layout",
    path: "expenseDetails/:id",
    index: void 0,
    caseSensitive: void 0,
    module: route7
  },
  "routes/debtRelationship": {
    id: "routes/debtRelationship",
    parentId: "components/common/layout",
    path: "debtRelationship",
    index: void 0,
    caseSensitive: void 0,
    module: route8
  },
  "routes/login": {
    id: "routes/login",
    parentId: "root",
    path: "login",
    index: void 0,
    caseSensitive: void 0,
    module: route9
  },
  "routes/example": {
    id: "routes/example",
    parentId: "root",
    path: "example",
    index: void 0,
    caseSensitive: void 0,
    module: route10
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
