"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

interface DropdownProps {
  auto?: boolean;
  items: string[];
  placeholder: string;
  getSelectedItem?: (value: string) => void;
  clearSelection?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  items,
  placeholder,
  getSelectedItem,
  clearSelection,
  auto,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (item: string) => {
    setSelectedItem(item);
    setIsOpen(false);
  };

  useEffect(() => {
    if (auto && items.length > 0) {
      setSelectedItem(items[0]);
    }
  }, [auto, items]);

  useEffect(() => {
    if (getSelectedItem && selectedItem) {
      getSelectedItem(selectedItem);
    }
  }, [selectedItem]);

  useEffect(() => {
    if (clearSelection) {
      console.log("clearing selection");
      setSelectedItem(null);
    }
  }, [clearSelection]);

  return (
    <div className="relative inline-block min-w-56">
      <div
        className={`w-full bg-stone-200 flex items-center justify-between gap-1 font-medium rounded-md p-2 text-vq-secondary ${
          items.length > 1 ? "cursor-pointer" : ""
        }`}
        onClick={toggleDropdown}
      >
        {selectedItem ? selectedItem : placeholder}
        {items.length > 1 && (
          <div className="mt-1">
            {isOpen ? <FaChevronUp /> : <FaChevronDown />}
          </div>
        )}
      </div>
      {isOpen && items.length > 1 && (
        <ul className="absolute left-0 w-full mt-2 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          {items.map((item, index) => (
            <li
              key={index}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleItemClick(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
