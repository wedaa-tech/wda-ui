import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import DocHome from './pages/Docs/DocHome';
import Designer from './pages/Designer';
import React from 'react';
import { ReactKeycloakProvider } from '@react-keycloak/web';
import keycloak from './Keycloak';
import PrivateRoute from './helpers/PrivateRoute';
import ArchitecturesSection from './pages/Architecture/ArchitecturesSection';
import Review from './pages/Review/Review';
import Wizard from './pages/Wizard/Wizard';
import WizardSelection from './pages/Wizard/WizardSelection';
import FeedbackPage from './components/FeedbackTable';
import NavBar from './components/NavBar/NavBar';
import Generating from './components/Generating';
import { Box } from '@chakra-ui/react';
import AIWizard from './pages/AI/AIWizard';
import Transactions from './pages/Transactions/TransactionView';
import PendingTransactions from './pages/Transactions/PendingTransactions';
import { NotificationProvider } from './context/NotificationContext';

function App() {
    return (
        <ReactKeycloakProvider authClient={keycloak}
        initOptions={{
            onLoad: 'check-sso',
            silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
            checkLoginIframe: false
          }}
        >
        <NotificationProvider>
            <Router className="flex h-screen">
                <NavBar />
                <Box className="screen-body">
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
                        <PrivateRoute exact path="/aiwizard">
                            <AIWizard />
                        </PrivateRoute>
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
                        <PrivateRoute exact path="/transactions">
                            <Transactions />
                        </PrivateRoute>
                        <PrivateRoute exact path="/pendingTransactions">
                            <PendingTransactions />
                        </PrivateRoute>
                        <Route exact path="/docs">
                            <DocHome />
                        </Route>
                        <PrivateRoute exact path="/feedbacks">
                            <FeedbackPage />
                        </PrivateRoute>
                    </Switch>
                </Box>
            </Router>
            </NotificationProvider>
        </ReactKeycloakProvider>
    );
}

export default App;
