import { useAppDispatch, useAppSelector } from "../../app/hook";
import { logout } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

function Header() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const user = useAppSelector((state) => state.auth.user);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/login");
    }
    return (
        <header className="header">
            <div className="brand">Taskflow</div>
            <div className="header-actions">
                <span>Welcome, { user?.name }</span>
                <button type="button" onClick={handleLogout}>Logout</button>
            </div>
        </header>
    )
}

export default Header;