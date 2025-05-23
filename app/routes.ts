import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./components/common/Layout.tsx", [
    // index("routes/home.tsx"),
    index("routes/personalDashboard.tsx"),
    route("createEvent", "routes/createEvent.tsx"),
    route("events/:id", "routes/eventDashboard.tsx"),
    route("addExpense/:id", "routes/addExpense.tsx"),
    route("expenseDetails/:id", "routes/expenseDetail.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("example", "routes/example.tsx"),
] satisfies RouteConfig;
