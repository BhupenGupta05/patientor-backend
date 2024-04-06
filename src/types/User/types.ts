export interface UserEntry {
    id: string,
    name: string,
    username: string,
    password: string,
}

export type NewUserEntry = Omit<UserEntry, "id">;
