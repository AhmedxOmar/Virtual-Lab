import { Link } from "react-router-dom";
import { useState } from "react";
import AuthModalManager from "./AuthModalManager";
import logo from "../assets/final-logo.png"


const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null); // Controls which modal is open

    return (
        <nav style={styles.navbar}>
            {/* Logo */}
            <Link to="/" style={styles.logo} className="flex items-center text-center">
                <img className="p-[0.5rem]" src={logo} alt="" width={70} />
                Virtual Lab
            </Link>

            {/* Navigation Links */}
            <div style={styles.navLinks}>
                <Link to="/docs/chapter_1_introduction_to_image_processing" className="text-white text-[18px] transition-colors">Docs</Link>
                <Link to="/About" className="text-white text-[18px] transition-colors">About</Link>
                <Link to="/Blog" className="text-white text-[18px] transition-colors">Blog</Link>
                <Link to="/Community" className="text-white text-[18px] transition-colors">Community</Link>
            </div>

            {/* Sign Up Button */}
            <button
                className="bg-white text-black cursor-pointer border-none py-[8px] px-[16px] rounded-[8px] ease-in-out font-bold"
                style={styles.button}
                onClick={() => setActiveModal('signup')}
            >
                Sign Up
            </button>

            {/* Auth Modal Manager */}
            {activeModal && (
                <AuthModalManager
                    activeModal={activeModal}
                    setActiveModal={setActiveModal}
                />
            )}
        </nav>
    );
};

// ✅ Improved Styling
const styles = {
    navbar: {
        background: "#181818",
        padding: "0px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "white",
        position: "sticky",
        top: 0,
        width: "100%",
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
        borderBottom: "1px solid #252525",
        fontFamily: "Poppins"
    },
    button: {
        fontFamily: "Poppins",
        fontSize: "1rem",
    },
    logo: {
        fontSize: "20px",
        fontWeight: "bold",
        textDecoration: "none",
        color: "white",
    },
    navLinks: {
        display: "flex",
        gap: "1.5rem",
    },
};

export default Navbar;
