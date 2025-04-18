import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import AuthModalManager from "./AuthModalManager";
import logo from "../assets/final-logo.png";
import Searchbar from "./Searchbar";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";
import defaultAvatar from "../assets/default-avatar.png";

const Navbar = () => {
    const [activeModal, setActiveModal] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        setShowDropdown(false);
        navigate("/");
    };

    return (
        <nav style={styles.navbar}>
            <Link to="/" style={styles.logo} className="flex items-center text-center">
                <img className="p-[0.5rem]" src={logo} alt="logo" width={70} />
                Virtual Lab
            </Link>

            <div style={styles.navLinks}>
                <Link to="/docs/chapter_1_1_what_is_image_processing" className="text-white text-[18px] transition-colors">Docs</Link>
                <Link to="/about" className="text-white text-[18px] transition-colors">About</Link>
                <Link to="/Blog" className="text-white text-[18px] transition-colors">Blog</Link>
                <Link to="/community" className="text-white text-[18px] transition-colors">Community</Link>
            </div>

            <div className="flex gap-[2rem] items-center">
                <div className="mx-4 hidden md:block mr-[5rem]">
                    <Searchbar />
                </div>

                {user ? (
                    <div className="relative cursor-pointer">
                        <div onClick={() => setShowDropdown(!showDropdown)} className="flex items-center gap-2">
                            <img
                                src={`${user.image || defaultAvatar}?v=${Date.now()}`}
                                alt="User"
                                className="w-10 h-10 rounded-full object-cover"
                            />
                            <span className="text-white font-semibold">{user.name}</span>
                        </div>
                        {showDropdown && (
                            <div className="absolute right-0 mt-2 w-48 bg-white text-black rounded-md shadow-lg z-50">
                                <div className="px-4 py-2 cursor-pointer" onClick={() => {
                                    setShowDropdown(false);
                                    navigate("/profile");
                                }}>
                                    Profile Dashboard
                                </div>
                                <div className="px-4 py-2  cursor-pointer" onClick={handleLogout}>
                                    Log out
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        className="bg-white text-black cursor-pointer border-none py-[8px] px-[16px] rounded-[8px] ease-in-out font-bold"
                        style={styles.button}
                        onClick={() => setActiveModal('signup')}
                    >
                        Sign Up
                    </button>
                )}
            </div>

            {activeModal && (
                <AuthModalManager activeModal={activeModal} setActiveModal={setActiveModal} />
            )}
        </nav>
    );
};

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
