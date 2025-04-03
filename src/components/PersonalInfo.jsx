import React, { useState } from "react";

const PersonalInfo = () => {
    const [editing, setEditing] = useState(false);
    const [errors, setErrors] = useState({}); // To store validation errors

    const [userInfo, setUserInfo] = useState({
        FullName: "Ahmed Omar",
        Email: "ahmed.w.dev01@gmail.com",
        Phone: "+201122477428",
    });

    const validateInput = (field, value) => {
        let error = "";

        if (field === "FullName") {
            if (!/^[a-zA-Z\s]{3,50}$/.test(value)) {
                error = "Invalid name (only letters, min 3 chars)";
            }
        } else if (field === "Email") {
            if (!/^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value)) {
                error = "Invalid email format";
            }
        } else if (field === "Phone") {
            if (!/^\+?\d{10,15}$/.test(value)) {
                error = "Invalid phone number";
            }
        }

        setErrors((prev) => ({ ...prev, [field]: error }));
        return error === "";
    };

    const handleChange = (e, field) => {
        const newValue = e.target.innerText.trim();
        setUserInfo({ ...userInfo, [field]: newValue });

        validateInput(field, newValue);
    };

    const handleEdit = () => {
        if (editing) {
            const isValid = Object.keys(userInfo).every((key) =>
                validateInput(key, userInfo[key])
            );

            if (!isValid) return; // Prevent saving if errors exist
        }
        setEditing(!editing);
    };

    return (
        <div className="personalInfo mt-[2rem]">
            <div className="flex justify-between mb-5">
                <h3 className="inter-semi-bold">Personal Info</h3>
                <button className="p-2 px-7 border border-[#252525] inter-medium" onClick={handleEdit}>
                    {editing ? "Save" : "Edit"}
                </button>
            </div>

            <div className="flex gap-9">
                {Object.entries(userInfo).map(([key, value]) => (
                    <div className="flex flex-col" key={key}>
                        <span className="text-[#ffffff80]">{key.replace(/([A-Z])/g, " $1")}</span>
                        <p
                            contentEditable={editing}
                            suppressContentEditableWarning={true}
                            className={`editable pt-2 ${errors[key] ? "border-red-500" : "border-gray-300"
                                }`}
                            onBlur={(e) => handleChange(e, key)}
                        >
                            {value}
                        </p>
                        {errors[key] && <span className="text-red-500 text-sm">{errors[key]}</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PersonalInfo;
