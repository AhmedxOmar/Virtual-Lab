import React, { useState } from 'react'

const Bio = () => {
    const [editing, setEditing] = useState(false);
    const [bio, setBio] = useState(
        "🚀 Ahmed Omar | 🖥️ Junior Web Developer @ Oswald Technologies\n" +
        "Hi! I'm Ahmed Omar, a junior web developer passionate about coding. 💡\n" +
        "I thrive on solving complex problems and staying ahead in the ever-evolving tech world! 🌍"
    );


    const handleEdit = () => setEditing(!editing);

    return (
        <div className='bioSection border border-[#252525] mt-[2rem] p-5'>
            <div className='flex justify-between mb-3'>
                <h3 className='inter-semi-bold'>Bio</h3>
                <button className='p-2 px-7 border border-[#252525] inter-medium' onClick={handleEdit}>{editing ? "Save" : "Edit"}</button>

            </div>
            {editing ? (
                <textarea value={bio} onChange={(e) => setBio(e.target.value)} />

            ) : (
                <p>{bio}</p>
            )}
        </div>
    );
};

export default Bio