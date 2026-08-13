import { useState, type SubmitEvent } from "react";

function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log("handleLoginSubmit");
    }
    return (
        <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-field">
                <label htmlFor="email">Email</label>
                <input 
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                    placeholder="Enter your email address"
                />
            </div>
            <div className="form-field">
                <div className="password-header">
                     <label htmlFor="password">Password</label>
                     <a href="/forgot-password">Forgot Password</a>
                </div>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="Enter your password"
                />
            </div>
            <button className="btn btn-primary" type="submit">Log in</button>
        </form>
    )
}

export default LoginForm;