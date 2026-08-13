import { useState } from "react"

function SignupForm() {
    const [name, setName] = useState<string>("");
    const [emailId, setEmailId] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    const handleSignupSubmit = () => {
        console.log("handleSignupSubmit");
    };
    return (
        <form className="auth-form" onSubmit={handleSignupSubmit}>
            <div className="form-field">
                <label htmlFor="name">Name</label>
                <input 
                    id="name"
                    type="text"
                    name="name"
                    value={name} 
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Enter your name"
                    required
                    autoComplete="name"
                />
            </div>
            <div className="form-field">
                <label htmlFor="emailId">Email</label>
                <input
                    id="emailId"
                    type="email"
                    name="email"
                    value={emailId}
                    autoComplete="email"
                    onChange={(event) => setEmailId(event?.target.value)}
                    placeholder="Enter your Email address" />
            </div>
            <div className="form-field">
                <label htmlFor="password">Password</label>
                <input 
                    id="password"
                    type="password" 
                    value={password} 
                    onChange={(event) => setPassword(event.target.value)}
                    autoComplete="new-password"
                    required
                    placeholder="Enter your password"
                />
            </div>
            <div className="form-field">
                <label htmlFor="password">Confirm Password</label>
                <input 
                    id="password"
                    type="confirmPassword" 
                    value={confirmPassword} 
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    autoComplete="confirm-password"
                    required
                    placeholder="Enter your password again"
                />
            </div>
            <div>
                <button className="btn btn-primary" type="submit">Singn up</button>
            </div>
        </form>
    )
}

export default SignupForm;