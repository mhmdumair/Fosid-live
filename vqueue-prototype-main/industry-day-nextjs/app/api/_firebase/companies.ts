import { firebaseDb as db } from "@/lib/services/firebase";
import {
  collection,
  doc,
  endBefore,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  limitToLast,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  startAt,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { filterData } from "@/lib/utils";
import {
  CreateCompanyInput,
  UpdateCompanyInput,
  GetCompaniesParams,
  GetCompanyParams,
  GetCompanyByNameParams,
} from "@/lib/models/params/company.params";
import {
  companyMapper,
  companiesMapper,
  companyNamesMapper,
} from "@/lib/models/mappers/company.mapper";

const collectionName = "companies";

export const getCompaniesCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("isActive", "==", true));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching companies count:", error);
    throw new Error("Failed to fetch companies count");
  }
};

export const getCompanies = async ({
  pageSize = 10,
  last,
  first,
  direction,
  name,
}: GetCompaniesParams) => {
  try {
    const filters: any[] = [];

    if (name) {
      filters.push(where("name", "==", name));
    }

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("companyId", "desc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("companyId", "desc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("companyId", "desc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return companiesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw new Error("Failed to fetch companies");
  }
};

export const getCompaniesNames = async () => {
  try {
    const filters: any[] = [];

    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, ...filters, orderBy("name", "asc"));
    const querySnap = await getDocs(q);

    return companyNamesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching companies names:", error);
    throw new Error("Failed to fetch companies names");
  }
};

export const getCompany = async ({ companyId }: GetCompanyParams) => {
  try {
    if (!companyId) {
      throw new Error("companyId is required");
    }

    const docRef = doc(db, collectionName, companyId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    return companyMapper(docSnap);
  } catch (error) {
    console.error("Error fetching company:", error);
    throw new Error("Failed to fetch company");
  }
};

export const getCompanyByName = async ({ name }: GetCompanyByNameParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(collectionRef, where("name", "==", name));
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return companyMapper(querySnap.docs[0]);
  } catch (error: any) {
    console.error("Error fetching company by name:", error);
    throw new Error(`Failed to fetch company by name: ${error.message}`);
  }
};

export const createCompany = async (data: CreateCompanyInput) => {
  try {
    const existingCompany = await getCompanyByName({ name: data.name });
    if (existingCompany) {
      throw new Error("Company already exists");
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      companyId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
    });

    console.log("Company created at: ", docRef.id);

    return getCompany({ companyId: docRef.id });
  } catch (e: any) {
    console.error("Error creating company: ", e);
    throw new Error(`Failed to create company: ${e.message}`);
  }
};

export const createCompaniesBatch = async (data: CreateCompanyInput[]) => {
  const batch = writeBatch(db);
  const existingCompanies: CreateCompanyInput[] = [];

  try {
    for (const companyData of data) {
      const existingCompany = await getCompanyByName({
        name: companyData.name,
      });
      if (existingCompany) {
        existingCompanies.push(companyData);
        continue; // Skip to the next room
      }

      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...filterData(companyData),
        id: docRef.id,
        companyId: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
      });
    }

    await batch.commit();
    console.log("Batch company creation successful");

    // Optionally, return the created rooms
    const createdCompanies = await Promise.all(
      data
        .filter(
          (companyData) =>
            !existingCompanies.some(
              (existing) => existing.name === companyData.name
            )
        )
        .map(async (companyData) => {
          const company = await getCompanyByName({ name: companyData.name });
          return company;
        })
    );

    return { createdCompanies, existingCompanies };
  } catch (e: any) {
    console.error("Error creating company batch: ", e);
    throw new Error(`Failed to create company batch: ${e.message}`);
  }
};

export const updateCompany = async (data: UpdateCompanyInput) => {
  try {
    const docRef = doc(db, collectionName, data.companyId);
    await updateDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Company doesn't exist or did not update");
    }

    return getCompany({ companyId: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating company: ", e);
  }
};

export const deleteCompany = async (companyId: string) => {
  try {
    const docRef = doc(db, collectionName, companyId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      isActive: false,
    });
    // await deleteDoc(docRef);
    console.log("Company deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting company: ", e);
    throw new Error(`Failed to delete company: ${e.message}`);
  }
};
