"use client";

import { FaX } from "react-icons/fa6";
import { useEffect, useState } from "react";
import { DirectionType } from "@/lib/models/params/params";
import { toast } from "../ui/use-toast";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { ICompany } from "@/lib/models/interfaces/ICompany";
import { GetCompaniesParams } from "@/lib/models/params/company.params";
import CompanySelector from "./company-selector";
import CompanyLink from "./company-link";
import { getCookie } from "cookies-next";
import { UserUnion } from "@/lib/models/unions/user.union";

export default function StallLinks() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);
  const [clearCompanySelection, setClearCompanySelection] = useState(false);
  const [pageCount, setPageCount] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [page, setPage] = useState(1);
  const [first, setFirst] = useState<string | undefined>(undefined);
  const [last, setLast] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<DirectionType>("next");
  const [isLoading, setIsLoading] = useState(true);

  const [currentUserId, setCurrentUserId] = useState<string>();
  const [currentUser, setCurrentUser] = useState<UserUnion>();

  useEffect(() => {
    const user = getCookie("currentUser");
    if (user) {
      const uid = JSON.parse(user).uid;
      setCurrentUserId(uid);
    }
  }, []);

  useEffect(() => {
    if (currentUserId) {
      fetchUserById({ id: currentUserId });
    } else {
      console.log("no authenticated user");
    }
  }, [currentUserId]);

  useEffect(() => {
    if (currentUser) {
      console.log(currentUser);
    } else {
      console.log("no authenticated user");
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchCompaniesCount = async () => {
      const res = await fetch("/api/companies/count", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const data = await res.json();
        // console.log(data);
        setPageCount(Math.ceil(data.count / pageSize));
      } else {
        toast({
          title: "Error fetching companies count",
          description: "Failed to fetch companies count",
          variant: "destructive",
        });
      }
    };

    fetchCompaniesCount();
    fetchCompanies({ pageSize, direction });
  }, []);

  useEffect(() => {
    console.log({ page, direction });
    if (direction === "next") {
      fetchCompanies({ pageSize, last, direction });
    } else if (direction === "prev") {
      fetchCompanies({ pageSize, first, direction });
    }
  }, [page, direction]);

  useEffect(() => {
    if (selectedCompany) {
      // console.log({ selectedCompany });
      fetchCompanies({ pageSize, direction, name: selectedCompany });
    } else {
      fetchCompanies({ pageSize, direction });
    }
  }, [selectedCompany, setSelectedCompany]);

  const fetchUserById = async ({ id }: { id: string }) => {
    try {
      // setIsLoading(true); // Start loading
      const res = await fetch(`/api/users/user/linked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        throw new Error(`Error: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();
      const fetchedUser = data.user;

      if (fetchedUser) {
        setCurrentUser(fetchedUser);
      }

      setIsLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching queues:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching queues. ${error}`,
      });
    }
  };

  const buildQueryParams = ({
    pageSize,
    last,
    first,
    direction,
    isStalls = false,
    name = undefined,
  }: GetCompaniesParams): string => {
    const params = new URLSearchParams();

    if (pageSize !== undefined) {
      params.append("limit", pageSize.toString());
    }

    if (direction !== undefined) {
      params.append("direction", direction);
    }

    if (direction === "prev" && first) {
      params.append("first", first);
    }

    if (direction === "next" && last) {
      params.append("last", last);
    }

    if (name) {
      params.append("name", `${name}`);
    }

    if (isStalls) {
      params.append("isStalls", isStalls.toString());
    }

    return params.toString();
  };

  const fetchCompanies = async ({
    pageSize = 10,
    last = undefined,
    name = undefined,
  }: GetCompaniesParams) => {
    try {
      setIsLoading(true); // Start loading
      const query = buildQueryParams({
        pageSize,
        first,
        last,
        direction,
        name,
        isStalls: true,
      });

      // console.log({ query });
      const res = await fetch(`/api/companies/?${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const fetchedCompanies = await res.json();
      const count = fetchedCompanies.querySnapshot.length;

      setCompanies(fetchedCompanies.querySnapshot);
      setFirst(fetchedCompanies.querySnapshot[0]?.companyId);
      setLast(fetchedCompanies.querySnapshot[count - 1]?.companyId);
      setIsLoading(false); // End loading
    } catch (error) {
      console.error("Error fetching companies:", error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: `Error fetching companies. ${error}`,
      });
    }
  };

  const prevPage = () => {
    setDirection("prev");
    setPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const nextPage = () => {
    setDirection("next");
    setPage((prevPage) => Math.min(prevPage + 1, pageCount));
  };

  const getSelectedCompany = (company: string) => {
    setSelectedCompany(company);
  };

  const clearSelections = () => {
    setSelectedCompany(null);
    setClearCompanySelection(true); // Trigger the clearSelection
    setTimeout(() => setClearCompanySelection(false), 0); // Reset the clearSelection to false
  };

  return (
    <div className="w-full">
      <div className="mb-5 flex">
        <CompanySelector
          getSelectedValue={getSelectedCompany}
          clearSelection={clearCompanySelection}
        />
        <Button
          className="flex font-normal gap-2 bg-stone-800 hover:bg-slate-700"
          onClick={clearSelections}
        >
          Clear <FaX size={12} />
        </Button>
      </div>

      <ul className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {isLoading
          ? Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton
                key={idx}
                className="bg-vq-pearl h-40 w-full rounded-md"
              />
            ))
          : companies?.map((company) => (
              <CompanyLink
                key={company.id}
                user={currentUser}
                id={company.id}
                name={company.name}
                email={company.email}
                stalls={company.stalls}
              />
            ))}
      </ul>
      <div className="border border-slate-300 flex justify-between items-center w-full mt-5 p-4 rounded-lg mb-16">
        <span className="font-medium text-sm">
          Results per page: {pageSize}
        </span>
        {!selectedCompany && (
          <span className="font-bold">
            Page {page} of {pageCount}
          </span>
        )}
        <div className="flex gap-1">
          <Button
            onClick={prevPage}
            disabled={page === 1 || selectedCompany !== null}
            size="sm"
            className="rounded-sm hover:bg-slate-700"
          >
            Prev
          </Button>
          <Button
            onClick={nextPage}
            disabled={page === pageCount || selectedCompany !== null}
            size="sm"
            className="rounded-sm hover:bg-slate-700"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
