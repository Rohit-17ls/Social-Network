import React, {createContext, useState} from "react";

export const AuthContext = createContext();

const AuthContextProvider = (props) => {

    const [credentials, setCredentials] = useState({
                                                    username : '',
                                                    email : '',
                                                    password : ''
                                                    })

    const authValue = {

        setUsername : (username) => {
                setCredentials(prevCredentials => ({...prevCredentials, username}));
        },

        setEmail : (email) => {
            setCredentials(prevCredentials => ({...prevCredentials, email}));
        },

        setPassword : (password) => {
            setCredentials(prevCredentials => ({...prevCredentials, password}));
        },

        // Validate Credentials - Not defined yet
        validateCredentials : () => {
            return {error : 'Error'};
        },

        postCredentials : (authenticationMode) => {
            console.log(authenticationMode, credentials);

            // authenticationMode -> login || signup
            
            return fetch(`http://localhost:3000/api/${authenticationMode}`, {
                method : 'POST',
                credentials: authenticationMode === 'signup' ? 'omit' : 'include',
                headers: {
                    'Content-Type' : 'application/json'
                },
                body : JSON.stringify(credentials)
            });

            // const result = await res.json();
            // console.log(result);
            // */
        }

    }


    return(
        <AuthContext.Provider value={authValue}>{props.children}</AuthContext.Provider>
    )

}

export default AuthContextProvider;