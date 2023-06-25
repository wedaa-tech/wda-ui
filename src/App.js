import FormWdi from "./components/wdi/Form";
import FormWda from "./components/wda/Form";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import Products from "./pages/Products";
import DocHome from "./pages/Docs/DocHome";
// import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Designer from "./pages/Designer";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import PrivateRoute from "./helpers/PrivateRoute";

function App() {
  return (
    <ReactKeycloakProvider authClient={keycloak}>
        <Router className="flex h-screen">
          <Navbar />
          <Switch>
            <Route exact path="/wda">
              <PrivateRoute>
                <FormWda />
              </PrivateRoute>
            </Route>
            <Route exact path="/wdi">
              <PrivateRoute>
                <FormWdi />
              </PrivateRoute>
            </Route>
            <Route exact path="/">
              <Home />
            </Route>

            <Route exact path="/products">
              <Products />
            </Route>
            <Route exact path="/mindmap">
              <PrivateRoute>
                <Designer />
              </PrivateRoute>
            </Route>
            <Route exact path="/projects">
              <PrivateRoute>
                  <Projects/>
              </PrivateRoute>
            </Route>
            <Route exact path="/projects/:id">
            <PrivateRoute>
                  <Project/>
              </PrivateRoute>
            </Route>
            <Route exact path="/docs">
              <DocHome />
            </Route>
            {/* <Route exact path="/about">
          <About />
        </Route> */}
            <Route exact path="/contact">
              <Contact />
            </Route>
            <Route exact path="/login">
              <Login />
            </Route>
            <Route exact path="/signup">
              <SignUp />
            </Route>      
          </Switch>
          <Footer />
        </Router>
    </ReactKeycloakProvider>
  );
}

export default App;
