import { 
  Bell, 
  ChevronDown, 
  Search 
} from "lucide-react";
import { 
  useAppDispatch, 
  useAppSelector
} from "../../../app/hook";
import { logout } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { Button, Input } from "@ni3stack/ui";

import "./header.css"

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
      <div className="header-search">
        <Search size={17} />
        <Input
          type="search"
          placeholder="Search tasks, projects..."
          aria-label="Search tasks and projects"
        />
        <kbd>⌘ K</kbd>
      </div>
      <div className="header-actions">
        <Button 
          variant="ghost" 
          size="small" 
          aria-label="Notifications"
        >
          <Bell size={18} />
        </Button>
        <Button  variant="ghost" className="header-user">
          <span className="header-avatar">
            {user?.name?.charAt(0).toUpperCase()}
          </span>

          <span className="header-user-name">
            {user?.name}
          </span>

          <ChevronDown size={15} />
        </Button>
        <Button
          className="header-logout"
          variant="ghost"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </div>
    </header>
  );
}

export default Header;