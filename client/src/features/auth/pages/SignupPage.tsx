import { useState } from "react"

function SinupPage() {
    const [emailId, setEmailId] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const handleSignupSubmit = () => {

    };
    return (
        <form className="sinup-conatiner" onSubmit={handleSignupSubmit}>
            <div>
                <label htmlFor="emailId">Email Id</label>
                <input 
                    id="emailId"
                    type="text" 
                    value={emailId} 
                    onChange={(event) => setEmailId(event.target.value)}
                    placeholder="Enter your email address"
                    required
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
            <div>
                <button type="submit">Singn up</button>
            </div>
        </form>
    )
}

export default SinupPage;