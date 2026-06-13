export interface WeatherForecast {
    date: string;
    temperatureC: number;
    temperatureF: number;
    summary?: string;
}

// Authentication
export interface LoginCommand {
    email?: string;
    password?: string;
}

export interface TokenResult {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}

export interface MenuItem {
    id: number;
    label: string;
    icon?: string | null;
    to?: string | null;
    visible: boolean;
    parentId?: number | null;
    items?: MenuItem[] | null;
}

// Branch
export interface CreateBranchCommand {
    name: string;
    address?: string;
    phoneNumber?: string;
}

// Employee
export interface CreateEmployeeCommand {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    roleId: number;
    branchId: number;
}

export interface EmployeeDto {
    id: number;
    firstName: string;
    lastName: string;
    nickName: string;
    dateOfBirth: string;
    placeOfBirth: string;
    gender: number;
    passportNumber: string;
    taxId: string;
    isActive: boolean;
    roleIds: number[];
    roleCodes: string[];
}

// Employee Scheduling
export interface CreateEmployeeSchedulingCommand {
    employeeId: number;
    scheduleId: number;
    date: string; // ISO format: YYYY-MM-DD
}

// Product
export interface CreateProductCommand {
    name: string;
    code: string;
    description?: string;
    price: number;
    productTypeId: number;
    unitId: number;
    valueAddedTaxId: number;
}

export interface UpdateProductCommand extends CreateProductCommand {
    id: number;
}

export interface ProductDto {
    id: number;
    name: string;
    code: string;
    description?: string;
    price: number;
    productTypeId: number;
    productTypeName: string;
    unitId: number;
    unitName: string;
    valueAddedTaxId: number;
    valueAddedTaxPercentage: number;
}

// Product Type
export interface CreateProductTypeCommand {
    name: string;
    description?: string;
}

export interface UpdateProductTypeCommand extends CreateProductTypeCommand {
    id: number;
}

export interface ProductTypeDto {
    id: number;
    name: string;
    description?: string;
}

// Receipt
export interface CreateReceiptDetailCommand {
    productId: number;
    quantity: number;
    price: number;
}

export interface CreateReceiptCommand {
    branchId: number;
    tableId?: number;
    details: CreateReceiptDetailCommand[];
}

export interface UpdateReceiptCommand {
    id: number;
    branchId: number;
    tableId?: number;
    details: CreateReceiptDetailCommand[];
}

export interface ReceiptDetailDto {
    id: number;
    receiptId: number;
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    totalPrice: number;
}

export interface ReceiptDto {
    id: number;
    receiptNumber: string;
    branchId: number;
    branchName: string;
    tableId?: number;
    tableName?: string;
    totalAmount: number;
    status: string;
    createdDate: string;
    details: ReceiptDetailDto[];
}

// Role
export interface RoleDto {
    id: number;
    name: string;
    description?: string;
}

// Schedule
export interface CreateScheduleCommand {
    name: string;
    startTime: string; // HH:mm:ss
    endTime: string; // HH:mm:ss
}

// Table
export interface CreateTableCommand {
    name: string;
    branchId: number;
    capacity: number;
    status?: string;
}

export interface UpdateTableCommand extends CreateTableCommand {
    id: number;
}

export interface TableDto {
    id: number;
    name: string;
    branchId: number;
    branchName: string;
    capacity: number;
    status: string;
}

// Unit
export interface CreateUnitCommand {
    name: string;
    description?: string;
}

export interface UpdateUnitCommand extends CreateUnitCommand {
    id: number;
}

export interface UnitDto {
    id: number;
    name: string;
    description?: string;
}

// Value Added Tax
export interface CreateValueAddedTaxCommand {
    name: string;
    percentage: number;
}

export interface UpdateValueAddedTaxCommand extends CreateValueAddedTaxCommand {
    id: number;
}

export interface ValueAddedTaxDto {
    id: number;
    name: string;
    percentage: number;
}
