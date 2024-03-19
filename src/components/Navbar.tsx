import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const toggleMenu: React.MouseEventHandler<HTMLDivElement> = () => setIsOpen(!isOpen);
  const closeMenu: React.MouseEventHandler<HTMLAnchorElement> = () => setIsOpen(false);

  return (
    <>
        <nav className="navbar">
        <div className="logo">MyApp</div>
        <div className="hamburger" onClick={toggleMenu}>
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
        </div>
        </nav>
        <div className={`nav-items ${isOpen ? "open" : ""}`}>
            <Link to="/flashcards" onClick={closeMenu}>Flashcards</Link>
            <Link to="/chat" onClick={closeMenu}>Chat</Link>
        </div>
    </>
  );
};

export default Navbar;