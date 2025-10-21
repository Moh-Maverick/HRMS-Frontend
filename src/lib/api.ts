import axios from 'axios'
import {
    fsAssignUsersToDepartment,
    fsCloseJob,
    fsCreateDepartment,
    fsCreateJob,
    fsCreateUserWithAuth,
    fsDecideLeave,
    fsDeleteDepartment,
    fsDeleteUser,
    fsGetCandidates,
    fsGetDepartments,
    fsGetJobs,
    fsGetOffers,
    fsGetPendingLeaves,
    fsGetUsers,
    fsSaveProfile,
    fsScheduleInterview,
    fsGetMyLeaves,
    fsUpdateCandidateStatus,
    fsUpdateDepartment,
    fsUpdateJob,
    fsUpdateOfferStatus,
    fsUpdateUser,
} from '@/lib/firestoreApi'

const api = axios.create({ baseURL: process.env.NEXT_PUBLIC_API_BASE || 'https://api.example.com' })
const isFs = () => (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_USE_FIRESTORE === '1')

// Placeholder endpoints for future backend integration
export const Api = {
    // Admin
    getUsers: async () => isFs() ? fsGetUsers() : [
        { id: 'u1', name: 'Alice Johnson', email: 'alice@fwc.co.in', role: 'employee', department: 'Engineering' },
        { id: 'u2', name: 'Bob Singh', email: 'bob@fwc.co.in', role: 'manager', department: 'Sales' },
        { id: 'u3', name: 'Carol HR', email: 'carol@fwc.co.in', role: 'hr', department: 'HR' },
    ],
    createUser: async (payload: { name: string; email: string; password: string; role: string; department?: string }) => isFs() ? fsCreateUserWithAuth(payload) : ({ id: crypto.randomUUID(), ...payload }),
    updateUser: async (id: string, payload: Partial<{ name: string; email: string; role: string; department?: string }>) => isFs() ? fsUpdateUser(id, payload) : ({ id, ...payload }),
    deleteUser: async (id: string) => isFs() ? fsDeleteUser(id) : ({ success: true }),
    getDepartments: async () => isFs() ? fsGetDepartments() : (
        [
            { id: 'd1', name: 'Engineering', head: 'N. Sharma', employees: 24 },
            { id: 'd2', name: 'Sales', head: 'P. Gupta', employees: 15 },
        ]
    ),
    createDepartment: async (payload: { name: string; head?: string }) => isFs() ? fsCreateDepartment(payload) : ({ id: crypto.randomUUID(), ...payload }),
    updateDepartment: async (id: string, payload: { name?: string; head?: string }) => isFs() ? fsUpdateDepartment(id, payload) : ({ id, ...payload }),
    deleteDepartment: async (id: string) => isFs() ? fsDeleteDepartment(id) : ({ success: true }),
    assignUsersToDepartment: async (deptId: string, userIds: string[]) => isFs() ? fsAssignUsersToDepartment(deptId, userIds) : ({ success: true }),

    // HR
    getJobs: async () => isFs() ? fsGetJobs() : [
        { id: 'j1', title: 'Frontend Engineer', openings: 2, status: 'Open' },
        { id: 'j2', title: 'QA Analyst', openings: 1, status: 'Open' },
    ],
    createJob: async (payload: { title: string; openings: number }) => isFs() ? fsCreateJob(payload) : ({ id: crypto.randomUUID(), status: 'Open', ...payload }),
    updateJob: async (id: string, payload: Partial<{ title: string; openings: number; status: string }>) => isFs() ? fsUpdateJob(id, payload) : ({ id, ...payload }),
    closeJob: async (id: string) => isFs() ? fsCloseJob(id) : ({ id, status: 'Closed' }),
    getCandidates: async () => isFs() ? fsGetCandidates() : [
        { id: 'c1', name: 'Rahul', status: 'Screening', jobId: 'j1', score: 0.82 },
        { id: 'c2', name: 'Priya', status: 'Interview', jobId: 'j2', score: 0.77 },
    ],
    updateCandidateStatus: async (id: string, status: string) => isFs() ? fsUpdateCandidateStatus(id, status) : ({ id, status }),

    // Manager
    getTeam: async () => [{ id: 't1', name: 'Esha', role: 'SDE2' }, { id: 't2', name: 'Karan', role: 'SDE1' }],
    getAttendance: async () => ({ present: 18, absent: 2, late: 1 }),
    getPerformance: async () => ([{ name: 'Esha', score: 87 }, { name: 'Karan', score: 78 }]),
    getPendingLeaves: async () => isFs() ? fsGetPendingLeaves() : ([{ id: 'lv1', employee: 'Esha', days: 2, reason: 'Medical' }, { id: 'lv2', employee: 'Karan', days: 1, reason: 'Personal' }]),
    decideLeave: async (id: string, decision: 'approved' | 'rejected') => isFs() ? fsDecideLeave(id, decision) : ({ success: true, decision }),
    submitReview: async (_employee: string, _score: number, _notes?: string) => ({ success: true }),

    // Employee
    getPayroll: async () => ({ month: 'Oct', amount: 95000, status: 'Processed' }),
    getLeaves: async () => isFs() ? fsGetMyLeaves() : ([{ id: 'l1', from: '2025-10-12', to: '2025-10-13', type: 'Sick', reason: 'Fever', days: 2, status: 'approved' }]),
    submitLeave: async (payload: { from: string; to: string; type: string; reason: string }) => isFs() ? (await import('@/lib/firestoreApi')).fsSubmitLeave(payload) : ({ success: true }),
    submitFeedback: async (text: string) => isFs() ? (await import('@/lib/firestoreApi')).fsSubmitFeedback(text) : ({ success: true }),
    saveProfile: async (payload: any) => isFs() ? fsSaveProfile(payload) : ({ success: true }),

    // Candidate
    getInterviewSchedule: async () => ([{ id: 'i1', date: '2025-10-20', panel: 'Frontend' }]),
    getApplicationStatus: async () => ({ status: 'Screening' }),
}

export default api


