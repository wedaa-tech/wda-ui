import FormWdi from "./components/wdi/Form";
import FormWda from "./components/wda/Form";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import DocHome from "./pages/Docs/DocHome";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Designer from "./pages/Designer";
import Projects from "./pages/Projects";
import Project from "./pages/Project";
import React from "react";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./Keycloak";
import PrivateRoute from "./helpers/PrivateRoute";
import SuccessPage from "./pages/SuccessPage";
import ProjectsSection from "./pages/ProjectsSection";
import ArchitecturesSection from "./pages/Architecture";
import Review from "./pages/Rewiew";

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
          <Route exact path="/success">
            <SuccessPage />
          </Route>
          <Route exact path="/canvasToCode">
            {/* <PrivateRoute> */}
            <Designer update={false} />
            {/* </PrivateRoute> */}
          </Route>
          <Route exact path="/projects">
            <PrivateRoute>
              <ProjectsSection />
            </PrivateRoute>
          </Route>
          <Route path="/project/:parentId/architectures">
            <PrivateRoute>
              <ArchitecturesSection />
            </PrivateRoute>
          </Route>
          <Route exact path="/project/:parentId/architecture/:id/edit">
            <PrivateRoute>
              <Designer update={true} />
            </PrivateRoute>
          </Route>
          <Route exact path="/project/:parentId/architecture/:id">
            <PrivateRoute>
              <Designer update={true} viewMode />
            </PrivateRoute>
          </Route>
          <Route exact path="/project/:parentId/architecture/:id/details">
            <PrivateRoute>
              <Review />
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
        {/* <Footer /> */}
      </Router>
    </ReactKeycloakProvider>
  );
}

export default App;
