import { DiagnosisEntry } from "../Diagnosis/types";

export interface BaseEntry {
    id: string,
    date: Date,
    description: string,
    specialist: string,
    diagnosisCodes?: Array<DiagnosisEntry["code"]>
}

export enum HealthCheckRating {
    "Healthy" = 0,
    "LowRisk" = 1,
    "HighRisk" = 2,
    "CriticalRisk" = 3
}
export interface HealthCheckEntry extends BaseEntry {
    healthCheckRating: HealthCheckRating,
    type: "HealthCheck"
}

export interface HospitalEntry extends BaseEntry {
    discharge?: {
        date: Date,
        criteria: string
    }
    type: "Hospital"
}

export interface OccupationalHealthcareEntry extends BaseEntry {
    employerName: string,
    sickLeave?: {
        startDate: Date,
        endDate: Date,
    },
    type: "OccupationalHealthcare"
}

export type Entry = HospitalEntry | OccupationalHealthcareEntry | HealthCheckEntry;

// trick to exlude id from each and every entry while adding entry data
type UnionOmit<T, K extends string | number | symbol> = T extends unknown ? Omit<T, K> : never;

export type EntryWithoutId = UnionOmit<Entry, "id">;