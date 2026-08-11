import { useState, type SubmitEvent } from "react";

function LoginForm() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSubmit = (event:SubmitEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log({
            email,
            password
        })
    }
    return (
        <form onSubmit={handleSubmit}>
            <div>
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
            <div>
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                    placeholder="Enter your password"
                />
            </div>
            <button type="submit">Log in</button>
        </form>
    )
}

export default LoginForm;