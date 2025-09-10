import { House, LibraryBig, Settings, User, Users } from "lucide-react";
import Button from "./ui/Button";

const SideNavigation = () => {
    return (
        <div className="px-4 py-6 border-r border-gray-400 h-full w-[220px] text-center bg-white shadow-md">
            <div className="flex flex-col justify-between h-full">
                <div className="flex flex-col gap-4">
                    {/* Početna dugme */}
                    <Button 
                        title="Početna" 
                        icon={<House />} 
                        className="transition-all duration-200 ease-in-out hover:bg-sky-800 hover:text-white" 
                    />
                    {/* Mušterije dugme */}
                    <Button 
                        title="Mušterije" 
                        icon={<Users />} 
                        className="transition-all duration-200 ease-in-out hover:bg-green-500 hover:text-white" 
                    />
                    {/* Izvodi dugme */}
                    <Button 
                        title="Izvodi" 
                        icon={<LibraryBig />} 
                        className="transition-all duration-200 ease-in-out hover:bg-yellow-500 hover:text-white" 
                    />
                </div>
                
                <div className="flex flex-col gap-4">
                    {/* Podešavanja dugme */}
                    <Button 
                        title="Podešavanja" 
                        icon={<Settings />} 
                        className="transition-all duration-200 ease-in-out hover:bg-sky-500 hover:text-white" 
                    />
                    {/* Nalog dugme */}
                    <Button 
                        title="Nalog" 
                        icon={<User />} 
                        className="transition-all duration-200 ease-in-out hover:bg-red-500 hover:text-white" 
                    />
                </div>
            </div>
        </div>
    );
}

export default SideNavigation;
