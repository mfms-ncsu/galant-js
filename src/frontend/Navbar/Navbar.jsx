import './Navbar.scss';

import { NavLink } from "react-router-dom";

/**
 * This holds the top Navbar for all parts of the website.
 */
function Navbar(props) {

    return (
        <nav className='navbar'>
            <div className='nav_container'>
                <div className='logo'>
                    <NavLink to="/" className="navbar__content__logo">
                        <img id='galant_logo' src='/img/galant_full_logo_without_words.svg' alt='The logo for Galant'/>
                    </NavLink>
                </div>
                <div className='nav-elements'>
                    <ul>
                        <li><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/collection'>Collection</NavLink></li>
                        <li><NavLink to='/tests'>Tests</NavLink></li>
                        <li><NavLink to='/documentation'>Documentation</NavLink></li>
                        <li>
                            <NavLink to='https://github.ncsu.edu/engr-csc-sdc/2023SpringTeam37-Stallmann' target="_blank">
                                <img id='github_logo' src='/img/github-mark.png' alt='Github logo' />
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );

}

export default Navbar;