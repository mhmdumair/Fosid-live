import { firebaseDb as db } from "@/lib/services/firebase";
import {
  arrayUnion,
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
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { calculateEndTime, filterData } from "@/lib/utils";
import {
  CreateQueueInput,
  GetQueueByNameStallNameParams,
  GetQueueParams,
  GetQueuesParams,
  UpdateQueueInput,
} from "@/lib/models/params/queue.params";

import { queueMapper, queuesMapper } from "@/lib/models/mappers/queue.mapper";
import { InterviewStatus } from "@/lib/models/enums/InterviewStatus";
import {
  getAllInterviews,
  getInterview,
  updateInterviewsBatch,
} from "./interviews";
import { appConfig } from "@/lib/config/app.config";
import { IQueue } from "@/lib/models/interfaces/IQueue";
import { QueueStatus } from "@/lib/models/enums/QueueStatus";

const collectionName = "queues";

export const getQueuesCount = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(coll, where("isActive", "==", true));
    const snapshot = await getCountFromServer(q);
    const count = snapshot.data().count;
    console.log("count: ", count);

    return count;
  } catch (error) {
    console.error("Error fetching queues count:", error);
    throw new Error("Failed to fetch queues count");
  }
};

export const getQueues = async ({
  pageSize = 10,
  last,
  first,
  direction,
  stallName,
}: GetQueuesParams) => {
  try {
    const filters: any[] = [];

    filters.push(where("isActive", "==", true));

    if (stallName) {
      filters.push(where("stallName", "==", stallName));
    }

    const collectionRef = collection(db, collectionName);
    let q;

    if (direction === "next" && last) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallName", "asc"),
        orderBy("name", "asc"),
        startAfter(last),
        limit(pageSize)
      );
    } else if (direction === "prev" && first) {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallName", "asc"),
        orderBy("name", "asc"),
        endBefore(first),
        limitToLast(pageSize)
      );
    } else {
      q = query(
        collectionRef,
        ...filters,
        orderBy("stallName", "asc"),
        orderBy("name", "asc"),
        limit(pageSize)
      );
    }

    const querySnap = await getDocs(q);

    return queuesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw new Error("Failed to fetch queue");
  }
};

export const getAllQueues = async () => {
  try {
    const coll = collection(db, collectionName);
    const q = query(
      coll,
      orderBy("stallName", "asc"),
      orderBy("name", "asc"),
      where("isActive", "==", true)
    );
    const querySnap = await getDocs(q);

    return queuesMapper(querySnap);
  } catch (error) {
    console.error("Error fetching queues:", error);
    throw new Error("Failed to fetch queues");
  }
};

export const getQueueById = async ({ queueId }: GetQueueParams) => {
  try {
    if (!queueId) {
      throw new Error("queueId is required");
    }

    const docRef = doc(db, collectionName, queueId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists() || docSnap.data().deletedAt) {
      return null;
    }

    console.log("Document data:", docSnap.data());
    return queueMapper(docSnap);
  } catch (error) {
    console.error("Error fetching queue:", error);
    throw new Error("Failed to fetch queue");
  }
};

// Export getQueueByName function
export const getQueueByNameStallName = async ({
  name,
  stallName,
}: GetQueueByNameStallNameParams) => {
  try {
    const collectionRef = collection(db, collectionName);
    const q = query(
      collectionRef,
      where("name", "==", name),
      where("stallName", "==", stallName)
    );
    const querySnap = await getDocs(q);

    if (querySnap.empty || querySnap.docs[0].data().deletedAt) {
      return null;
    }

    return queueMapper(querySnap.docs[0]);
  } catch (error: any) {
    console.error("Error fetching queue by name and stall name:", error);
    throw new Error(
      `Failed to fetch queue by name and stall name: ${error.message}`
    );
  }
};

// Export createQueue function
export const createQueue = async (data: CreateQueueInput) => {
  try {
    const existingQueue = await getQueueByNameStallName({
      name: data.name,
      stallName: data.stallName,
    });
    if (existingQueue) {
      throw new Error("Queue already exists");
    }

    const docRef = doc(collection(db, collectionName));

    await setDoc(docRef, {
      ...filterData(data),
      id: docRef.id,
      queueId: docRef.id,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
      isActive: true,
      baseTime: appConfig.queues.baseTime,
    });

    console.log("Queue created at: ", docRef.id);

    return getQueueById({ queueId: docRef.id });
  } catch (e: any) {
    console.error("Error creating queue: ", e);
    throw new Error(`Failed to create queue: ${e.message}`);
  }
};

export const createQueuesBatch = async (data: CreateQueueInput[]) => {
  const batch = writeBatch(db);
  const existingQueues: CreateQueueInput[] = [];

  try {
    for (const queueData of data) {
      const existingQueue = await getQueueByNameStallName({
        name: queueData.name,
        stallName: queueData.stallName,
      });
      if (existingQueue) {
        existingQueues.push(queueData);
        continue; // Skip to the next room
      }

      const docRef = doc(collection(db, "queues"));
      batch.set(docRef, {
        ...filterData(queueData),
        id: docRef.id,
        queueId: docRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        isActive: true,
        baseTime: appConfig.queues.baseTime,
      });
    }

    await batch.commit();
    console.log("Batch queue creation successful");

    // Optionally, return the created queues
    const createdQueues = await Promise.all(
      data
        .filter(
          (queueData) =>
            !existingQueues.some((existing) => existing.name === queueData.name)
        )
        .map(async (queueData) => {
          const queue = await getQueueByNameStallName({
            name: queueData.name,
            stallName: queueData.stallName,
          });
          return queue;
        })
    );

    return { createdQueues, existingQueues };
  } catch (e: any) {
    console.error("Error creating queue batch: ", e);
    throw new Error(`Failed to create queue batch: ${e.message}`);
  }
};

// Export updateQueue function
export const updateQueue = async (data: UpdateQueueInput) => {
  try {
    const docRef = doc(db, collectionName, data.queueId);
    await updateDoc(docRef, {
      ...filterData(data),
      queueId: docRef.id,
      updatedAt: serverTimestamp(),
    });
    const updatedDocSnap = await getDoc(docRef);

    if (!updatedDocSnap.exists()) {
      throw new Error("Queue doesn't exist or did not update");
    }

    return getQueueById({ queueId: updatedDocSnap.id });
  } catch (e) {
    console.error("Error updating queue: ", e);
  }
};

export const updateQueuesBatch = async (data: UpdateQueueInput[]) => {
  const batch = writeBatch(db);
  const nonExistingQueues: UpdateQueueInput[] = [];

  try {
    for (const queueData of data) {
      const existingQueue = await getQueueByNameStallName({
        name: queueData.name!,
        stallName: queueData.stallName!,
      });
      if (!existingQueue) {
        nonExistingQueues.push(queueData);
        continue; // Skip to the next queue
      }

      const docRef = doc(db, "queues", existingQueue.queueId);
      batch.update(docRef, {
        ...filterData(queueData),
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
    console.log("Batch queue update successful");

    // Optionally, return the updated queues
    const updatedQueues = await Promise.all(
      data
        .filter(
          (queueData) =>
            !nonExistingQueues.some(
              (nonExisting) => nonExisting.name === queueData.name
            )
        )
        .map(async (queueData) => {
          const queue = await getQueueByNameStallName({
            name: queueData.name!,
            stallName: queueData.stallName!,
          });
          return queue;
        })
    );

    return { updatedQueues, nonExistingQueues };
  } catch (e: any) {
    console.error("Error updating queue batch: ", e);
    throw new Error(`Failed to update queue batch: ${e.message}`);
  }
};

// Export deleteQueue function
export const deleteQueue = async (queueId: string) => {
  try {
    const docRef = doc(db, collectionName, queueId);
    await updateDoc(docRef, {
      deletedAt: serverTimestamp(),
    });
    // await deleteDoc(docRef);
    console.log("Queue deleted: ", docRef.id);

    return docRef.id;
  } catch (e: any) {
    console.error("Error deleting queue: ", e);
    throw new Error(`Failed to delete queue: ${e.message}`);
  }
};

export const addInterviewToQueue = async ({
  queueName,
  interviewId,
  companyCode,
  stallName,
}: {
  queueName: string;
  interviewId: string;
  companyCode?: string;
  stallName?: string;
}) => {
  try {
    if (!stallName) {
      if (!companyCode) {
        throw new Error("Either stallName or companyCode must be provided");
      }
      stallName = `${companyCode}1`;
    }

    const interview = await getInterview({
      interviewId,
    });

    if (!interview) {
      throw new Error("Interview not found");
    }

    if (!interview.isAssignedToQueue) {
      const queue = await getQueueByNameStallName({
        name: queueName,
        stallName,
      });

      if (!queue) {
        throw new Error("Queue not found");
      }

      const docRef = doc(db, "queues", queue.queueId);
      await updateDoc(docRef, {
        interviewIds: arrayUnion(interviewId),
        updatedAt: serverTimestamp(),
      });

      const interviewIds = queue.interviewIds;
      const endTime = calculateEndTime({
        interviewIds: interviewIds ?? [],
        baseTime: queue.baseTime,
      });

      // Determine the session based on the start time
      const startTimeDate = endTime.toDate();
      const startTimeHours = startTimeDate.getHours();
      const startTimeMinutes = startTimeDate.getMinutes();
      const session = startTimeHours < 12 ? 'M' : 'A';
      let interviewStatus = InterviewStatus.WAITING;

      // Assuming 4pm is the cutoff for overloaded status
      if (startTimeHours > 16 || (startTimeHours === 16 && startTimeMinutes > 0)) {
        interviewStatus = InterviewStatus.UNSURE;
      }

      const interviewDocRef = doc(db, "interviews", interviewId);
      await updateDoc(interviewDocRef, {
        stallName: stallName,
        isAssignedToQueue: true,
        startTime: endTime,
        position: interviewIds ? interviewIds.length + 1 : 1,
        status: interviewStatus,
        session: session,
      });
    }

    console.log(
      "Interview added to queue: ",
      interviewId,
      " in queue: ",
      queueName
    );
  } catch (e: any) {
    console.error("Error adding interview to queue: ", e);
    throw new Error(`Failed to add interview to queue: ${e.message}`);
  }
};

export const autoAssignInterviewsToQueues = async () => {
  let queues: IQueue[] = [];

  const autoAssignPrelisted = async () => {
    try {
      const preListInterviews = await getAllInterviews({ type: "P" });
      queues = await getAllQueues();

      await Promise.all(
        preListInterviews.map(async (interview) => {
          if (!interview.isAssignedToQueue) {
            const queuesByStallName = queues.filter(
              (q) => q.stallName === interview.stallName
            );

            const queue = queuesByStallName.filter(
              (q) => q.name === interview.queueName
            )[0];

            if (!queue) {
              throw new Error("Queue not found");
            }

            const endTime = calculateEndTime({
              interviewIds: queue.interviewIds ?? [],
              baseTime: queue.baseTime,
            });

            interview.status = InterviewStatus.WAITING;
            interview.isAssignedToQueue = true;
            interview.startTime = endTime;
            interview.position = queue.interviewIds
              ? queue.interviewIds.length + 1
              : 1;

            if (!queue.interviewIds || queue.interviewIds.length === 0) {
              queue.interviewIds = [interview.id];
            } else if (!queue.interviewIds.includes(interview.id)) {
              queue.interviewIds.push(interview.id);
            }

            // Check and update the queue status
            if (queue.interviewIds.length > 0) {
              queue.queueStatus = QueueStatus.AVAILABLE;
            }

            const lastInterviewEndTime = calculateEndTime({
              interviewIds: queue.interviewIds,
              baseTime: queue.baseTime,
            });

            const lastInterviewDate = lastInterviewEndTime.toDate();
            const lastInterviewHours = lastInterviewDate.getHours();
            const lastInterviewMinutes = lastInterviewDate.getMinutes();

            // Assuming 4pm is the cutoff for overloaded status
            if (
              lastInterviewHours > 16 ||
              (lastInterviewHours === 16 && lastInterviewMinutes > 0)
            ) {
              queue.queueStatus = QueueStatus.OVERLOADED;
            }
          }
        })
      );

      await Promise.all([
        updateQueuesBatch(queues),
        updateInterviewsBatch(preListInterviews),
      ]);

      return preListInterviews;
    } catch (e: any) {
      throw new Error(`Failed to auto-assign prelisted interviews: ${e}`);
    }
  };

  const autoAssignWalkin = async () => {
    // Dictionary to track the end time of each student's last assigned interview
    const studentEndTimes: { [regNo: string]: Date } = {};

    try {
      const walkinInterviews = await getAllInterviews({ type: "W" });
      queues = await getAllQueues();

      await Promise.all(
        walkinInterviews.map(async (interview) => {
          if (!interview.isAssignedToQueue) {
            const queuesByStallName = queues.filter(
              (q) => q.stallName === interview.stallName
            );

            let minQueue = queuesByStallName[0]; // Default to the first queue
            let minCount = minQueue.interviewIds
              ? minQueue.interviewIds.length
              : 0;

            queuesByStallName.forEach((queue) => {
              const count = queue.interviewIds ? queue.interviewIds.length : 0;
              if (count < minCount) {
                minCount = count;
                minQueue = queue;
              }
            });

            // Calculate start time based on the number of interviews already scheduled
            let baseTime =
              minQueue.baseTime?.toDate() ?? appConfig.queues.baseTime.toDate();

            if (typeof baseTime === "string") {
              baseTime = new Date(baseTime);
            }
            baseTime.setMinutes(baseTime.getMinutes() + minCount * 10);

            // Ensure the new interview does not overlap with the student's other interviews
            const studentRegNo = interview.studentRegNo;
            const studentEndTime = studentEndTimes[studentRegNo];

            if (studentEndTime && studentEndTime > baseTime) {
              // If the student's previous interview ends after the base start time,
              // set the start time for this interview to be after the student's previous interview
              baseTime.setTime(studentEndTime.getTime());
              baseTime.setMinutes(baseTime.getMinutes());
            }

            // Update the end time for this student's interview
            studentEndTimes[studentRegNo] = new Date(baseTime);
            studentEndTimes[studentRegNo].setMinutes(
              studentEndTimes[studentRegNo].getMinutes() + 10
            );

            // Check if the IST time is before 12:00 noon
            const noonTime = new Date(baseTime);
            noonTime.setHours(12, 0, 0, 0);

            const session = baseTime.getTime() < noonTime.getTime() ? "M" : "A";

            interview.queueName = minQueue.name;
            interview.stallName = minQueue.stallName;
            interview.isAssignedToQueue = true;
            interview.startTime = Timestamp.fromDate(baseTime);
            interview.status = InterviewStatus.WAITING;
            interview.session = session;
            interview.position = minQueue.interviewIds
              ? minQueue.interviewIds.length + 1
              : 1;

            if (minQueue.interviewIds) {
              minQueue.interviewIds.push(interview.interviewId);
            } else {
              minQueue.interviewIds = [interview.interviewId];
            }

            // Find the index of the minQueue in the original queues array and update it
            const queueIndex = queues.findIndex(
              (q) => q.queueId === minQueue.queueId
            );
            if (queueIndex !== -1) {
              queues[queueIndex] = minQueue;
            }
          }
        })
      );

      await Promise.all([
        updateQueuesBatch(queues),
        updateInterviewsBatch(walkinInterviews),
      ]);

      return walkinInterviews;
    } catch (e: any) {
      throw new Error(`Failed to auto-assign walk-in interviews: ${e}`);
    }
  };

  try {
    // First Allocate all prelisted interviews
    const p = await autoAssignPrelisted();
    const w = await autoAssignWalkin();

    return { queues };
  } catch (e: any) {
    console.error("Error adding interviews to queues: ", e);
    throw new Error(`Failed to add interviews to queues: ${e.message}`);
  }
};
