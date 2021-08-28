import React, { useState, useEffect } from 'react';
import './loginPage.css';
import authenticationService from "../services/AuthenticationService";

const LoginPage = props => {
    const [username, setUsername] = useState(null),
        [password, setPassword] = useState(null),
        [rememberMe, setRememberMe] = useState(false),
        [isAuthenticated, setIsAutheticated] = useState(null);
    authenticationService.registerForLoginStatusChangedEvent((isUserLoggedIn) =>
        setIsAutheticated(isUserLoggedIn));

    const loginClicked = async () => {
        if (!username) {
            alert("Missing username");
            return;
        } else if (!password) {
            alert("Missing password");
            return;
        }

        const response = await authenticationService.login(username, password, rememberMe);
        if (authenticationService.isUserLoggedIn()) {
            props.history.push("/");
        } else {
            alert(response.message);
        }
    };

    const changedUsername = (event) => {
        const username = String(event.target.value);
        setUsername(username);
    };

    const changedPassword = (event) => {
        setPassword(event.target.value);
    };

    const rememberMeClicked = (event) => {
        setRememberMe(event.target.checked);
    };

    const signUpClicked = (event) => {
        window.location.href = '/register'
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            loginClicked(event);
        }
    }

    useEffect(() => {
        const loginAttemptWithCookies = async () => {
            await authenticationService.login(null, null, false);
            if (authenticationService.isUserLoggedIn()) {
                props.history.push("/");
            }
        };
        loginAttemptWithCookies()
            .then(res => {
                console.log("Login success with cookies")
            });
    }, []);


    if (isAuthenticated === null) {
        return null;
    } else {
        return <div className="login">
            <div className="site-login-container">
                <img className="login-logo" src={process.env.PUBLIC_URL + "/logo-icon.png"} />
                <input type="text" id='username' placeholder="Username" onChange={changedUsername}
                    onKeyDown={handleKeyDown} />
                <input type="password" id="password" placeholder="Password" onChange={changedPassword}
                    onKeyDown={handleKeyDown} />
                <label className="checkbox-container">Remember me
                        <input type="checkbox" className="remember-me-checked" checked={rememberMe}
                        onChange={rememberMeClicked}
                        onKeyDown={handleKeyDown} />
                    <span className="checkmark" />
                </label>
                <button type="button" className="login-button" onClick={loginClicked}>LOGIN</button>
                <button type="sign-up" className="signup-button" onClick={signUpClicked}>SIGN UP</button>
            </div>
        </div>;
    }

}

export default LoginPage;
