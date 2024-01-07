import './Navbar.scss';

import { NavLink } from "react-router-dom";
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from "@mui/material/IconButton";


function openAlgorithmEditor() {
    window.open('/algorithmeditor','Algorithm Editor','width=600,height=900');
}

function openGraphEditor() {
    window.open('/grapheditor','Graph Editor','width=600,height=900');
}

function openEditors() {
    openAlgorithmEditor();
    openGraphEditor();
}

/**
 * This holds the top Navbar for all parts of the website.
 */
function Navbar(props) {

    return (
        <nav className='navbar'>
            <div className='nav_container'>
                <div className='hamburger'>
                <IconButton size="large" onClick={() => {props.setdisplaySidebar(!props.displaySidebar)}} >
                    <MenuIcon fontSize="large" />
                </IconButton>
                </div>
                <div className='logo'>
                    <NavLink to="/" className="navbar__content__logo">
                        <img id='galant_logo' src='/img/galant_full_logo_without_words.svg' alt='The logo for Galant'/>
                    </NavLink>
                </div>
                <div className='nav-elements'>
                    <ul>
                        <li><button className="navbar_button" onClick={openAlgorithmEditor}>Algorithm Editor</button></li>
                        <li><button className="navbar_button" onClick={openGraphEditor}>Graph Editor</button></li>
                        <li><NavLink to='/'>Home</NavLink></li>
                        <li><NavLink to='/collection'>Examples</NavLink></li>
                        <li>
                            <NavLink to='https://github.com/mfms-ncsu/galant-js' target="_blank">
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
