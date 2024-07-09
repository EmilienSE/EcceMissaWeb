export type Formify<T extends object> = {
    [key in keyof T]: any[];
};
