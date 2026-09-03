import blueIcon20 from "../../assets/images/img_icon_blue_gray_900_16x22.svg";
import blueIcon18 from "../../assets/images/img_icon_blue_gray_900_18x16.svg";
import blueIcon20x18 from "../../assets/images/img_icon_blue_gray_900_20x18.svg";
import icon16 from "../../assets/images/img_icon_16x16.svg";
import icon20 from "../../assets/images/img_icon_20x18.svg";

function CustomerNavbar({ activeTab, onNavigate }) {
  const navigationItems = [
    {
      id: "home",
      label: "Home",
      image: blueIcon18,
    },
    {
      id: "products",
      label: "Products",
      image: blueIcon20x18,
    },
    {
      id: "orders",
      label: "Orders",
      image: icon20,
    },
    {
      id: "track",
      label: "Track",
      image: blueIcon20,
    },
    {
      id: "profile",
      label: "Profile",
      image: icon16,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-header-border bg-white shadow-lg">
      <div className="flex w-full items-center justify-center gap-5 px-3 py-2">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-1 rounded-md px-3 py-2 transition ${
              activeTab === item.id
                ? "bg-background-accent"
                : ""
            }`}
          >
            <img
              src={item.image}
              alt=""
              className="h-5 w-5 object-contain"
            />

            <span className="text-[10px] text-text-primary sm:text-xs">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
}

export default CustomerNavbar;