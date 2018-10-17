import React from 'react';
import './header.css';

export default class Header extends React.Component {
    render() {
        return <nav className="top-nav" id="top-nav">
            <div className="logo-container">
                <a href="/">
                    <img
                        src="./images/movie-search-logo.png"
                        className="logo"
                        alt="site logo"
                        width="15%"
                        height="15%"/>
                </a>
            </div>
        </nav>
    }
}