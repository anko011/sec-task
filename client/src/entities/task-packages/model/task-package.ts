export enum TaskPackageStatus {
    ACTIVE = 'ACTIVE',
    FIXED = 'FIXED'
}

export type BaseDocument = {
    name: string;
    url: string;
};

export type TaskPackage = {
    id: string;
    name: string;
    baseDocument: BaseDocument;
    incomingRequisite: string;
    outgoingRequisite: string;
    status: TaskPackageStatus;
    tasksNumber: number;
};
