import React from 'react'
import { useEffect, useState } from 'react'
import ProfileHeader from './ProfileHeader';
import ProfileSidebar from './ProfileSidebar';
import PersonalInfo from './PersonalInfo';
import Bio from './Bio';
import UserAchievements from './UserAchievements';
import PasswordTab from './PasswordTab';

const Profile = () => {
    const [user, setUser] = useState(null);

    const [activeTab, setActiveTab] = useState("overview");

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    if (!user) {
        return <p>Loading</p>
    }

    return (
        <div className='profile-container flex gap-12 py-[5rem]'>
            <ProfileSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === "overview" && (
                <div>
                    <ProfileHeader />
                    <hr className='text-[#98989840] mt-[4rem] mb-[2rem]' />
                    <PersonalInfo />
                    <Bio />
                </div>
            )}
            {activeTab === "achievements" && (
                <UserAchievements />
            )}
            {activeTab === "password" && (
                <PasswordTab />
            )}

            {/* <h1>Welcome, {user.firstName} {user.lastName}</h1>
            <p>Email: {user.email}</p> */}
        </div>
    )
}

export default Profile