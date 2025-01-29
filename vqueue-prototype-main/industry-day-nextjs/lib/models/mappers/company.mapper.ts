import { DocumentData, QuerySnapshot } from "firebase/firestore";
import { ICompany } from "../interfaces/ICompany";

// unit

export function genericCompanyMapper<T>(doc: DocumentData): T {
  return {
    ...doc.data(),
    id: doc.data().id,
    code: doc.data()?.code,
    companyId: doc.data().companyId,
    name: doc.data().name,
    email: doc.data().email,
    address: doc.data()?.address,
    phone1: doc.data()?.phone1,
    phone2: doc.data()?.phone2,
    stallNames: doc.data().stallNames,
    status: doc.data().status,
    createdAt: doc.data().createdAt.toDate(),
    updatedAt: doc.data().updatedAt.toDate(),
    deletedAt: doc.data().deletedAt?.toDate(),
  } as T;
}

export function genericCompaniesMapper<T>(
  querySnapshot: QuerySnapshot<DocumentData>
): T[] {
  return querySnapshot.docs.map((doc) => genericCompanyMapper<T>(doc)) as T[];
}

export function companyMapper(doc: DocumentData): ICompany {
  return genericCompanyMapper<ICompany>(doc);
}

export function companiesMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): ICompany[] {
  return genericCompaniesMapper<ICompany>(querySnapshot);
}

export function companyNamesMapper(
  querySnapshot: QuerySnapshot<DocumentData>
): string[] {
  return querySnapshot.docs.map((doc) => doc.data().name);
}
