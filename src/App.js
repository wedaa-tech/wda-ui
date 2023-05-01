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

function App() {
  return (
    <Router className="flex h-screen">
      <Navbar />
      <Switch>
        <Route exact path="/wda">
          <FormWda />
        </Route>
        <Route exact path="/wdi">
          <FormWdi />
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/products">
          <Products />
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
      </Switch>
      <Footer />
    </Router>
  );
}

export default App;
