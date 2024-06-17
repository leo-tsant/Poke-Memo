// import { useState } from "react";
import "../Styles/App.css";
import Header from "./Header.jsx";
import Content from "./Content.jsx";
import Footer from "./Footer.jsx";

function App() {
    return (
        <div className="mainContainer">
            <Header />
            <Content />
            <Footer />
        </div>
    );
}

export default App;
