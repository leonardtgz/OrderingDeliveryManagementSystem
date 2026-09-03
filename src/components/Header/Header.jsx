import notificationIcon from "../../assets/images/img_notification_light_blue_900.svg";
import userIcon from "../../assets/images/img_user_light_blue_900.svg";

function Header({ onProfileClick }) {
  return (
    <header className="border-b border-header-border bg-header-background">
      <div className="flex items-center justify-between px-4 py-4 sm:px-6 md:px-8">

        {/* Logo / System Name */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-bold text-text-primary">
            GoldenPR
          </h1>
        </div>

        {/* Header Icons */}
        <div className="flex items-center gap-2">

          {/* Notifications */}
          <button
            type="button"
            className="rounded-md p-2 transition hover:bg-background-accent"
            aria-label="Notifications"
          >
             <img
               src={notificationIcon}
               alt="Notifications"
               className="h-6 w-6 object-contain"
             />
          </button>

          {/* User */}
          <button
            type="button"
            className="rounded-md p-2 transition hover:bg-background-accent"
            aria-label="Profile"
            onClick={onProfileClick}
          >
            <img
              src={userIcon}
              alt="Profile"
              className="h-5 w-5 object-contain"
            />
          </button>

        </div>
      </div>
    </header>
  );
}

export default Header;