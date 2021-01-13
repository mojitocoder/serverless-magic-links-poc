import React, { useEffect, useState } from "react";
import Auth from "@aws-amplify/auth";

export default () => {
    const [session, setSession] = useState(null);

    const getSession = async() => {
        try {
            const user = await Auth.currentSession();
            setSession(user);
        } catch (e) {
        }
    };

    const signOut = async () => {
        await Auth.signOut();
        typeof window !== 'undefined' && window.location.reload();
    };

    const resetPassword = async () => {
        await Auth.forgotPassword(session.idToken.payload.email)
        alert('Reset password email should be sent out shortly');
    }

    useEffect(() => {
        getSession();
    }, []);

    return (
        <>
            <h1>Hi, user!</h1>

            <p>You're now signed in. Awesome, right?</p>
            <button onClick={signOut}>Sign out</button>

            <p>Session object:</p>
            <pre>{JSON.stringify(session, null, 2)}</pre>

            <p>Forget your password?</p>
            <button onClick={resetPassword}>Reset password</button>
        </>
    );
}
