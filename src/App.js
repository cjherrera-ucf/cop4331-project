import React from "react";
import "./App.css";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages";
import SigninPage from "./pages/signin";
import AdminPage from "./pages/admin";
import EmployeePage from "./pages/employee";
import GuestPage from './pages/guestpage';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/signin" component={SigninPage} exact />
        <Route path="/admin" component={AdminPage} exact />
        <Route path="/employee" component={EmployeePage} exact />
        <Route path='/guestpage' component={GuestPage} exact />
      </Switch>
    </Router>
  );
}

export default App;
