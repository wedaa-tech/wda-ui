import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import DocHome from './pages/Docs/DocHome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Designer from './pages/Designer';
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './Keycloak';
import PrivateRoute from './helpers/PrivateRoute';
import ProjectsSection from './pages/ProjectsSection';
import ArchitecturesSection from './pages/Architecture';
import Review from './pages/Rewiew';
import Wizard from './pages/Wizad';

function App() {
    return (
        <ReactKeycloakProvider authClient={keycloak}>
            <Router className="flex h-screen">
                <Navbar />
                <Switch>
                    <Route exact path="/canvasToCode">
                        <Designer update={false} />
                    </Route>
                    <Route exact path="/wizard">
                        <Wizard />
                    </Route>
                    <Route exact path="/">
                        <Wizard />
                    </Route>
                    </Route>
                    <Route exact path="/projects">
                        <PrivateRoute>
                            <ProjectsSection />
                        </PrivateRoute>
                    </Route>
                    <Route path="/project/:parentId/architectures" exact>
                        <PrivateRoute>
                            <ArchitecturesSection />
                        </PrivateRoute>
                    </Route>
                    <Route exact path="/project/:parentId/architecture/:id/edit">
                        <PrivateRoute>
                            <Designer update={true} />
                        </PrivateRoute>
                    </Route>
                    <Route exact path="/project/:parentId/architecture/create/">
                        <PrivateRoute>
                            <Designer update={false} viewMode={false} />
                        </PrivateRoute>
                    </Route>
                    <Route exact path="/project/:parentId/architecture/:id">
                        <PrivateRoute>
                            <Designer update={true} viewMode />
                        </PrivateRoute>
                    </Route>
                    <Route exact path="/project/:parentId/architecture/:id/details/">
                        <PrivateRoute>
                            <Review />
                        </PrivateRoute>
                    </Route>
                    <Route exact path="/docs">
                        <DocHome />
                    </Route>
                    <Route exact path="/login">
                        <Login />
                    </Route>
                    <Route exact path="/signup">
                        <SignUp />
                    </Route>
                </Switch>
            </Router>
        </ReactKeycloakProvider>
    );
}

export default App;
