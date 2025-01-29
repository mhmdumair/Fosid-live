// components/ui/HamburgerIcon.tsx

import { FaBars, FaTimes } from "react-icons/fa";

interface HamburgerIconProps {
  isOpen: boolean;
  toggleMenu: () => void;
}

export const HamburgerIcon: React.FC<HamburgerIconProps> = ({
  isOpen,
  toggleMenu,
}) => {
  return (
    <button onClick={toggleMenu} className="text-2xl focus:outline-none text-vq-secondary">
      {isOpen ? <FaTimes /> : <FaBars />}
    </button>
  );
};
