import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

export default function DocsLayout() {
    return (
        <div className="flex h-full">
            {/* Sidebar - Scrolls Separately */}
            <Sidebar />

            {/* Main Content - Scrolls Independently */}
            <main className="flex-1 p-6 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
