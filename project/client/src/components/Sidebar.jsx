import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, CloudRain, MapPin, MessageSquareText } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-menu">
        <NavLink to="/dashboard" end className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/soil-weather" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <CloudRain size={20} />
          <span>Soil & Weather</span>
        </NavLink>
        
        <NavLink to="/my-farms" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <MapPin size={20} />
          <span>My Farms</span>
        </NavLink>

        <NavLink to="/chat" className={({isActive}) => isActive ? "menu-item active" : "menu-item"}>
          <MessageSquareText size={20} />
          <span>Ask AI</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
