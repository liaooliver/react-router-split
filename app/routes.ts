import {
  type RouteConfig,
  index,
  route,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./components/common/layout.tsx", [
    index("routes/home.tsx"),
    route("dashboard", "routes/personalDashboard.tsx"),
    route("createEvent", "routes/createEvent.tsx"),
    route("events/:id", "routes/eventDashboard.tsx"),
    route("addExpense", "routes/addExpense.tsx"),
    route("expenseDetails/:id", "routes/expenseDetail.tsx"),
    route("debtRelationship", "routes/debtRelationship.tsx"),
  ]),
  route("login", "routes/login.tsx"),
  route("example", "routes/example.tsx"),
] satisfies RouteConfig;
