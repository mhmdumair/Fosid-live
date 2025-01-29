"use client";

import { useEffect, useState } from "react";
import Dropdown from "./dropdown";

interface Props {
  auto?: boolean;
  getSelectedValue?: (value: string) => void;
  clearSelection?: boolean;
}

export default function CompanySelector({
  getSelectedValue,
  clearSelection,
  auto,
}: Props) {
  const [companyList, setCompanyList] = useState<string[]>([]);
  const [currentCompanyIndex, setCurrentCompanyIndex] = useState(0);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/companies/names`
      );
      const data = await res.json();
      setCompanyList(data.querySnapshot);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <Dropdown
        items={companyList}
        placeholder="Company"
        getSelectedItem={getSelectedValue}
        clearSelection={clearSelection}
        auto={auto}
      />
    </div>
  );
}
