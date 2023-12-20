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
import WizardSelection from './pages/Wizad/WizardSelection';
import FeedbackPage from './components/FeedbackTable';
import NavBar from './components/NavBar';
import Generating from './components/Generating';
import { Box } from '@chakra-ui/react';

function App() {
    return (
        <ReactKeycloakProvider authClient={keycloak}>
            <Router className="flex h-screen">
                <NavBar />
                <Box className='screen-body'>
                    <Switch>
                        <Route exact path="/canvasToCode">
                            <Designer update={false} />
                        </Route>
                        <Route exact path="/wizard">
                            <Wizard />
                        </Route>
                        <Route exact path="/wizardselection">
                            <WizardSelection />
                        </Route>
                        <Route exact path="/">
                            <Wizard />
                        </Route>
                        <Route exact path="/gen">
                            <Generating />
                        </Route>
                        <PrivateRoute exact path="/projects">
                            <ArchitecturesSection />
                        </PrivateRoute>
                        <PrivateRoute path="/architectures" exact>
                            <ArchitecturesSection />
                        </PrivateRoute>
                        <PrivateRoute path="/prototypes" exact>
                            <ArchitecturesSection />
                        </PrivateRoute>
                        <PrivateRoute exact path="/project/:parentId/architecture/:id/edit">
                            <Designer update={true} />
                        </PrivateRoute>
                        <PrivateRoute exact path="/project/:parentId/architecture/create/">
                            <Designer update={false} viewMode={false} />
                        </PrivateRoute>
                        <PrivateRoute exact path="/project/:parentId/architecture/:id">
                            <Designer update={true} viewMode />
                        </PrivateRoute>
                        <PrivateRoute exact path="/project/:parentId/architecture/:id/details/">
                            <Review />
                        </PrivateRoute>
                        <Route exact path="/docs">
                            <DocHome />
                        </Route>
                        <Route exact path="/login">
                            <Login />
                        </Route>
                        <Route exact path="/signup">
                            <SignUp />
                        </Route>
                        <PrivateRoute exact path="/feedbacks">
                            <FeedbackPage />
                        </PrivateRoute>
                    </Switch>
                </Box>
            </Router>
        </ReactKeycloakProvider>
    );
}

export default App;
