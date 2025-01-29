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
  AssignInterviewToQueueParams,
  CreateInterviewInput,
  GetInterviewByStudentQueueCompanyParams,
  GetInterviewParams,
  GetInterviewsParams,
  UpdateInterviewInput,
} from "@/lib/models/params/interview.params";
import {
  interviewMapper,
  interviewMappers,
} from "@/lib/models/mappers/interview.mapper";
import { getCompanyByName } from "./companies";
import { CompanyCode } from "@/lib/models/enums/CompanyCodes";

const collectionName = "interviews";

export const getInterviewsCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("isActive", "==", true));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching interviews count:", error);
    throw new Error("Failed to fetch interviews count");
  }
};

export const getAllInterviews = async ({ type }: { type?: string }) => {
  try {
    const coll = collection(db, collectionName);
    let q;

    if (type === "P") {
      q = query(
        coll,
        orderBy("stallName", "asc"),
        orderBy("type", "asc"),
        orderBy("session", "desc"),
        orderBy("position", "asc"),
        where("isActive", "==", true)
      );
    } else if (type === "W") {
      q = query(
        coll,
        orderBy("stallName", "asc"),
        orderBy("type", "asc"),
        orderBy("preference", "asc"),
        orderBy("interviewId", "desc"),
        where("isActive", "==", true)
      );
    } else {
      // Handle case when type is neither 'P' nor 'W'
      q = query(coll, where("isActive", "==", true));
    }

    const querySnap = await getDocs(q);

    return interviewMappers(querySnap);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw new Error("Failed to fetch interviews");
  }
};

export const getInterviews = async ({
  pageSize = 10,
  last,
  first,
  direction,
  stallName,
  queueName,
  studentRegNo,
  isAssignedToQueue,
  type,
  all,
}: GetInterviewsParams) => {
  try {
    const filters: any[] = [];

    if (type) {
      filters.push(where("type", "==", type));
    }

    if (stallName) {
      filters.push(where("stallName", "==", stallName));
    }

    if (queueName) {
      filters.push(where("queueName", "==", queueName));
    }

    if (studentRegNo) {
      filters.push(where("studentRegNo", "==", studentRegNo));
    }

    if (isAssignedToQueue) {
      filters.push(where("isAssignedToQueue", "==", isAssignedToQueue));
    }

    const collectionRef = collection(db, collectionName);
    let q;

    if (all) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallName", "asc"),
        orderBy("queueName", "asc"),
        orderBy("session", "desc"),
        orderBy("position", "asc")
      );
    } else {
      if (direction === "next" && last) {
        q = query(
          collectionRef,
          ...filters,
          orderBy("stallName", "asc"),
          orderBy("queueName", "asc"),
          orderBy("session", "desc"),
          orderBy("position", "asc"),
          startAfter(last),
          limit(pageSize)
        );
      } else if (direction === "prev" && first) {
        q = query(
          collectionRef,
          ...filters,
          orderBy("stallName", "asc"),
          orderBy("queueName", "asc"),
          orderBy("session", "desc"),
          orderBy("position", "asc"),
          endBefore(first),
          limitToLast(pageSize)
        );
      } else {
        q = query(
          collectionRef,
          ...filters,
          orderBy("stallName", "asc"),
          orderBy("queueName", "asc"),
          orderBy("session", "desc"),
          orderBy("position", "asc"),
          limit(pageSize)
        );
      }
    }

    const querySnap = await getDocs(q);

    return interviewMappers(querySnap);
  } catch (error) {
    console.error("Error fetching interviews:", error);
    throw new Error("Failed to fetch interviews");
  }
};

export const getInterview = async ({ interviewId }: GetInterviewParams) => {
  try {
    if (!interviewId) {
      throw new Error("interviewId is required");
    }

    const docRef = doc(db, collectionName, interviewId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data()?.deletedAt) {
      return null;
    }

    return interviewMapper(docSnap);
  } catch (error: any) {
    console.error("Error fetching interview:", error);
    // throw new Error(`Failed to fetch interview: ${error.message}`);
    return null;
  }
};
export const getInterviewByStudentCompany = async ({
  studentRegNo,
  companyName,
}: GetInterviewByStudentQueueCompanyParams) => {
  try {
    console.log(studentRegNo, companyName);
    if (!studentRegNo || !companyName) {
      throw new Error("studentRegNo and companyName is required");
    }

    const collectionRef = collection(db, "interviews");
    const q = query(
      collectionRef,
      where("studentRegNo", "==", studentRegNo),
      where("companyName", "==", companyName)
    );
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return interviewMapper(querySnap.docs[0]);
  } catch (error) {
    console.error(
      "Error fetching interview by studentRegNo and companyName:",
      error
    );
    throw new Error(
      "Failed to fetch interview by studentRegNo and companyName"
    );
  }
};

export const createInterview = async (data: CreateInterviewInput) => {
  try {
    let companyName;

    if (data.companyName) {
      companyName = data.companyName;
    } else if (data.stallName) {
      const companyCode = data.stallName?.slice(0, -1);
      companyName = CompanyCode[companyCode as keyof typeof CompanyCode];
    } else {
      throw new Error("companyName or stallName is required");
    }

    const existingInterview = await getInterviewByStudentCompany({
      companyName: companyName,
      studentRegNo: data.studentRegNo,
    });
    if (existingInterview) {
      console.error("Error creating interview: Interview Exists");
      throw new Error(`Failed to create interview: Interview Exists`);
    }

    let stallName = data.stallName;

    if (!stallName) {
      const companyCode =
        CompanyCode[data.companyName as keyof typeof CompanyCode];
      stallName = `${companyCode}1`;
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      interviewId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      stallName: stallName,
    });

    console.log("Interview created at: ", docRef.id);

    return getInterview({ interviewId: docRef.id });
  } catch (e: any) {
    console.error("Error creating interview: ", e);
    throw new Error(`Failed to create interview: ${e.message}`);
  }
};

export const createInterviewsBatch = async (data: CreateInterviewInput[]) => {
  const batch = writeBatch(db);
  const existingInterviews: CreateInterviewInput[] = [];
  const failedInterviews: CreateInterviewInput[] = [];

  try {
    for (const interviewData of data) {
      let companyName: string;

      if (interviewData.companyName) {
        companyName = interviewData.companyName;
      } else if (interviewData.stallName) {
        const companyCode = interviewData.stallName?.slice(0, -1);
        companyName = CompanyCode[companyCode as keyof typeof CompanyCode];
      } else {
        failedInterviews.push(interviewData);
        continue;
      }

      interviewData.companyName = companyName;

      const existingInterview = await getInterviewByStudentCompany({
        companyName: interviewData.companyName,
        studentRegNo: interviewData.studentRegNo,
      });
      if (existingInterview) {
        existingInterviews.push(interviewData);
        continue; // Skip to the next room
      }

      let stallName = interviewData.stallName;

      if (!stallName) {
        const companyCode =
          CompanyCode[interviewData.companyName as keyof typeof CompanyCode];
        stallName = `${companyCode}1`;
      }

      const docRef = doc(collection(db, collectionName));
      batch.set(docRef, {
        ...filterData(interviewData),
        id: docRef.id,
        interviewId: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        stallName: stallName,
        companyName: companyName,
      });
    }

    await batch.commit();
    console.log("Batch interview creation successful");

    // Optionally, return the created interviews
    const createdInterviews = await Promise.all(
      data
        .filter(
          (interviewData) =>
            !existingInterviews.some(
              (existing) =>
                existing.companyName === interviewData.companyName &&
                existing.studentRegNo === interviewData.studentRegNo
            )
        )
        .map(async (interviewData) => {
          // Ensure companyName is valid before making the API call
          if (interviewData.companyName) {
            const interview = await getInterviewByStudentCompany({
              companyName: interviewData.companyName,
              studentRegNo: interviewData.studentRegNo,
            });
            return interview;
          } else {
            // Handle cases where companyName is null or undefined
            console.warn(
              `Skipping interview data with null or undefined companyName for studentRegNo: ${interviewData.studentRegNo}`
            );
            return null; // Or any other default value or error handling as needed
          }
        })
    );

    return { createdInterviews, existingInterviews, failedInterviews };
  } catch (e: any) {
    console.error("Error creating interview batch: ", e);
    throw new Error(`Failed to create interview batch: ${e.message}`);
  }
};

export const updateInterview = async (data: UpdateInterviewInput) => {
  try {
    const docRef = doc(db, collectionName, data.interviewId);
    await updateDoc(docRef, {
      ...filterData(data),
      interviewId: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Interview doesn't exist or did not update");
    }

    return getInterview({ interviewId: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating interview: ", e);
  }
};

export const updateInterviewsBatch = async (data: UpdateInterviewInput[]) => {
  const batch = writeBatch(db);
  const nonExistingInterviews: UpdateInterviewInput[] = [];

  try {
    for (const interviewData of data) {
      const existingInterview = await getInterview({
        interviewId: interviewData.interviewId,
      });

      if (!existingInterview) {
        nonExistingInterviews.push(interviewData);
        continue; // Skip to the next interview
      }

      const docRef = doc(db, "interviews", existingInterview.interviewId);
      batch.update(docRef, {
        ...filterData(interviewData),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    console.log("Batch interview update successful");

    // Optionally, return the updated interviews
    const updatedInterviews = await Promise.all(
      data
        .filter(
          (interviewData) =>
            !nonExistingInterviews.some(
              (nonExisting) =>
                nonExisting.interviewId === interviewData.interviewId
            )
        )
        .map(async (interviewData) => {
          const interview = await getInterview({
            interviewId: interviewData.interviewId,
          });
          console.log("existingInterview 2: ", interview);
          return interview;
        })
    );

    return { updatedInterviews, nonExistingInterviews };
  } catch (e: any) {
    console.error("Error updating interview batch: ", e);
    throw new Error(`Failed to update interview batch: ${e.message}`);
  }
};

export const deleteInterview = async (interviewId: string) => {
  try {
    const docRef = doc(db, collectionName, interviewId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
      isActive: false,
    });
    console.log("Interview deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting interview: ", e);
    throw new Error(`Failed to delete interview: ${e.message}`);
  }
};
