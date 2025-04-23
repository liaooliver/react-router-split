import { addEventMember } from "./fetchEventMembers";
import { createUserWithEmailAndPassword, auth } from "../lib/firebase";
import { fetchProtectedFindOrCreateUser } from "./fetchProtectedData";
import { ERROR_EXISTING_USER, ERROR_REGISTER, RANDOM_PASSWORD_LENGTH } from "../constants/member";
import { generateRandomPassword } from "../utils/string";

/**
 * 已存在用戶加入 event
 */
export async function addExistingUserToEvent({
  userId,
  eventId,
  clearInput,
  refreshEventDetail,
  setErrorMessage,
  setShowError,
}: {
  userId: string;
  eventId: string;
  clearInput: () => void;
  refreshEventDetail: () => void;
  setErrorMessage: (msg: string) => void;
  setShowError: (show: boolean) => void;
}) {
  try {
    await addEventMember({ event_id: eventId, user_id: userId });
    clearInput();
    refreshEventDetail();
  } catch (err: any) {
    setErrorMessage(ERROR_EXISTING_USER + (err?.message || ""));
    setShowError(true);
  }
}

/**
 * 註冊新用戶並加入 event
 */
export async function registerAndAddNewUser({
  email,
  name,
  eventId,
  clearInput,
  refreshEventDetail,
  setErrorMessage,
  setShowError,
}: {
  email: string;
  name: string;
  eventId: string;
  clearInput: () => void;
  refreshEventDetail: () => void;
  setErrorMessage: (msg: string) => void;
  setShowError: (show: boolean) => void;
}) {
  const password = generateRandomPassword(RANDOM_PASSWORD_LENGTH);
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;
    const idToken = await user.getIdToken();
    await fetchProtectedFindOrCreateUser({
      email: user.email!,
      displayName: name.trim() || user.email!,
      uid: user.uid,
      idToken,
    });
    await addEventMember({ event_id: eventId, user_id: user.uid });
    clearInput();
    refreshEventDetail();
  } catch (err: any) {
    setErrorMessage(ERROR_REGISTER + (err?.message || ""));
    setShowError(true);
  }
}
