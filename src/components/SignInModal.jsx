import { useState, useEffect } from 'react'
import { AiOutlineClose } from 'react-icons/ai'



const SignInModal = ({ onClose, switchToSignUp }) => {

    const [userData, setUserData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState([]);

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const validateForm = () => {
        let newErrors = {};

        if (!userData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!emailPattern.test(userData.email)) {
            newErrors.email = "Invalid email format"
        }


        if (!userData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }


    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log('Form Submitted successfully', userData);
            setUserData({
                email: "",
                password: "",
            });
        }
    }


    const [visible, setVisible] = useState(false);

    useEffect(() => {
        setTimeout(() => setVisible(true), 10);
    }, []);

    return (
        <div style={styles.modalOverlay}>
            <div
                style={{
                    ...styles.modalContent,
                    transform: visible ? "translateY(0)" : "translateY(50px)",
                    opacity: visible ? 1 : 0,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-[16px] right-[16px] bg-transparent border-0 text-[#fff] cursor-pointer "
                >
                    <AiOutlineClose size={24} />
                </button>
                <h2 className="text-4xl font-bold text-center mt-[4rem]">
                    Welcome back! <br /> Sign in to continue
                </h2>
                <form
                    onSubmit={handleSubmit}
                    className="signInForm mt-8 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6 px-[31px]"
                >
                    <div className="sm:col-span-6">
                        <label
                            htmlFor="email"
                            className="block text-sm/6 font-medium text-[#A1A1A1]"
                        >
                            Email address
                        </label>
                        <div className="mt-2">
                            <input
                                name="email"
                                type="email"
                                value={userData.email}
                                onChange={handleChange}
                                className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-[white] outline-1 -outline-offset-1 outline-[#252525] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                            />
                            {errors.email && (
                                <p className="text-red-500 text-sm">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    <div className="sm:col-span-6">
                        <label
                            htmlFor="password"
                            className="block text-sm/6 font-medium text-[#A1A1A1]"
                        >
                            Password
                        </label>
                        <div className="mt-2">
                            <input
                                name="password"
                                type="password"
                                value={userData.password}
                                onChange={handleChange}
                                className="block w-full rounded-[7px] bg-[#0a0a0a] px-3 py-3 text-base text-[white] outline-1 -outline-offset-1 outline-[#252525] placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 sm:text-sm/6"
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="sm:col-span-6 rounded-[7px] px-3 py-2 text-sm font-semibold bg-white text-gray-950 shadow-xs hover:bg-[white] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-indigo-400"
                    >
                        Sign In
                    </button>

                    <p className="text-sm sm:col-span-6 text-center text-[#a1a1a1]">
                        Forgot your password? <span className="text-white cursor-pointer">Reset it here</span>
                    </p>
                </form>

                <div>
                    <p
                        className='text-sm sm:col-span-6 text-center text-[#a1a1a1] mt-3 pt-3.5 pb-3.5 border-t-1 border-[#252525] relative'
                        onClick={switchToSignUp}
                    >
                        Don't have an account? <span className='text-white cursor-pointer'>Sign Up</span>
                    </p>

                </div>
            </div>
        </div>
    )
}

const styles = {
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        transition: "opacity 0.9s ease-in-out",
    },
    modalContent: {
        background: "#0a0a0a",
        border: "1px solid #252525",
        borderRadius: "18px",
        width: "640px",
        minHeight: "auto",
        maxHeight: "90vh",
        overflowY: "none",
        transition: "transform 0.4s ease-in-out, opacity 0.4s ease-in-out",
        position: "relative"
    }
}

export default SignInModal
