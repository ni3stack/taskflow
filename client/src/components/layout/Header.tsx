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
        <header>
            <div>Taskflow</div>
            <div>
                <div>
                    <span>Welcome, { user?.name }</span>
                </div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </header>
    )
}

export default Header;