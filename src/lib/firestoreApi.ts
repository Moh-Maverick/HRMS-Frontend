import { auth, db } from '@/lib/firebase'
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, updateDoc, where } from 'firebase/firestore'

async function recalcDeptCount(deptName: string) {
    if (!deptName) return
    const usersSnap = await getDocs(query(collection(db, 'users'), where('department', '==', deptName)))
    const deptSnap = await getDocs(query(collection(db, 'departments'), where('name', '==', deptName)))
    for (const d of deptSnap.docs) {
        await updateDoc(doc(db, 'departments', d.id), { employees: usersSnap.size })
    }
}

// USERS
export async function fsGetUsers() {
    const snap = await getDocs(collection(db, 'users'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateUser(payload: { name: string; email: string; role: string; department?: string }) {
    const ref = await addDoc(collection(db, 'users'), payload)
    if (payload.department) await recalcDeptCount(payload.department)
    return { id: ref.id, ...payload }
}
export async function fsUpdateUser(id: string, payload: Partial<{ name: string; email: string; role: string; department?: string }>) {
    const before = await getDoc(doc(db, 'users', id))
    const beforeDept = (before.data() as any)?.department as string | undefined
    await updateDoc(doc(db, 'users', id), payload as any)
    const d = await getDoc(doc(db, 'users', id))
    const afterData = d.data() as any
    const afterDept = afterData?.department as string | undefined
    if (beforeDept && beforeDept !== afterDept) await recalcDeptCount(beforeDept)
    if (afterDept) await recalcDeptCount(afterDept)
    return { id, ...afterData }
}
export async function fsDeleteUser(id: string) {
    const snap = await getDoc(doc(db, 'users', id))
    const dept = (snap.data() as any)?.department as string | undefined
    await deleteDoc(doc(db, 'users', id))
    if (dept) await recalcDeptCount(dept)
    return { success: true }
}

// DEPARTMENTS
export async function fsGetDepartments() {
    const snap = await getDocs(collection(db, 'departments'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateDepartment(payload: { name: string; head?: string }) {
    const ref = await addDoc(collection(db, 'departments'), { ...payload, employees: 0 })
    return { id: ref.id, ...payload }
}
export async function fsUpdateDepartment(id: string, payload: { name?: string; head?: string }) {
    await updateDoc(doc(db, 'departments', id), payload as any)
    const d = await getDoc(doc(db, 'departments', id))
    return { id, ...(d.data() as any) }
}
export async function fsDeleteDepartment(id: string) {
    await deleteDoc(doc(db, 'departments', id))
    return { success: true }
}
export async function fsAssignUsersToDepartment(deptId: string, userIds: string[]) {
    const deptDoc = await getDoc(doc(db, 'departments', deptId))
    const dept = deptDoc.data() as any
    const deptName = dept?.name
    if (!deptName) return { success: false }
    await Promise.all(userIds.map((uid) => updateDoc(doc(db, 'users', uid), { department: deptName })))
    // recalc employees
    const qSnap = await getDocs(query(collection(db, 'users'), where('department', '==', deptName)))
    await updateDoc(doc(db, 'departments', deptId), { employees: qSnap.size })
    return { success: true }
}

// HR: JOBS
export async function fsGetJobs() {
    const snap = await getDocs(collection(db, 'jobs'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsCreateJob(payload: { title: string; openings: number }) {
    const ref = await addDoc(collection(db, 'jobs'), { ...payload, status: 'Open' })
    return { id: ref.id, ...payload, status: 'Open' }
}
export async function fsUpdateJob(id: string, payload: Partial<{ title: string; openings: number; status: string }>) {
    await updateDoc(doc(db, 'jobs', id), payload as any)
    const d = await getDoc(doc(db, 'jobs', id))
    return { id, ...(d.data() as any) }
}
export async function fsCloseJob(id: string) {
    await updateDoc(doc(db, 'jobs', id), { status: 'Closed' })
    return { id, status: 'Closed' }
}

// HR: CANDIDATES
export async function fsGetCandidates() {
    const snap = await getDocs(collection(db, 'candidates'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsUpdateCandidateStatus(id: string, status: string) {
    await updateDoc(doc(db, 'candidates', id), { status })
    return { id, status }
}

// HR: OFFERS
export async function fsGetOffers() {
    const snap = await getDocs(collection(db, 'offers'))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsUpdateOfferStatus(id: string, status: string) {
    await updateDoc(doc(db, 'offers', id), { status })
    return { id, status }
}

// HR: INTERVIEWS
export async function fsScheduleInterview(payload: { candidate: string; date: string; interviewer: string }) {
    const ref = await addDoc(collection(db, 'interviews'), payload)
    return { id: ref.id, ...payload }
}

// MANAGER: LEAVES
export async function fsGetPendingLeaves() {
    const snap = await getDocs(query(collection(db, 'leaves'), where('status', '==', 'pending')))
    return snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}
export async function fsDecideLeave(id: string, decision: 'approved' | 'rejected') {
    await updateDoc(doc(db, 'leaves', id), { status: decision })
    return { success: true, decision }
}

// EMPLOYEE: PROFILE
export async function fsSaveProfile(payload: any) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const ref = doc(db, 'profiles', uid)
    try {
        await updateDoc(ref, payload)
    } catch {
        // if doc missing, create
        await addDoc(collection(db, 'profiles'), { uid, ...payload })
    }
    return { success: true }
}

// EMPLOYEE: LEAVE REQUESTS
export async function fsSubmitLeave(payload: { from: string; to: string; type: string; reason: string }) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const fromDate = new Date(payload.from)
    const toDate = new Date(payload.to)
    const ms = Math.max(0, toDate.getTime() - fromDate.getTime())
    const days = Math.max(1, Math.ceil(ms / (1000 * 60 * 60 * 24)) + 1)
    await addDoc(collection(db, 'leaves'), { uid, from: payload.from, to: payload.to, type: payload.type, reason: payload.reason, days, status: 'pending', createdAt: Date.now() })
    return { success: true }
}

export async function fsGetMyLeaves() {
    const uid = auth.currentUser?.uid
    if (!uid) return []
    const qSnap = await getDocs(query(collection(db, 'leaves'), where('uid', '==', uid)))
    return qSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

// EMPLOYEE: FEEDBACK
export async function fsSubmitFeedback(text: string) {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    await addDoc(collection(db, 'feedbacks'), { uid, text, createdAt: Date.now() })
    return { success: true }
}

// EMPLOYEE: ATTENDANCE
export async function fsGetMyAttendance() {
    const uid = auth.currentUser?.uid
    if (!uid) return []
    const qSnap = await getDocs(query(collection(db, 'attendance'), where('uid', '==', uid)))
    return qSnap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }))
}

export async function fsMarkAttendance(status: 'present' | 'absent') {
    const uid = auth.currentUser?.uid
    if (!uid) return { success: false }
    const today = new Date().toISOString().split('T')[0]
    const timestamp = new Date().toISOString()

    // Check if attendance already marked for today
    const existingSnap = await getDocs(query(
        collection(db, 'attendance'),
        where('uid', '==', uid),
        where('date', '==', today)
    ))

    if (existingSnap.docs.length > 0) {
        // Update existing record
        await updateDoc(doc(db, 'attendance', existingSnap.docs[0].id), { status, timestamp })
    } else {
        // Create new record
        await addDoc(collection(db, 'attendance'), {
            uid,
            date: today,
            status,
            timestamp,
            createdAt: Date.now()
        })
    }
    return { success: true }
}


