export type Types<T extends (...args: any) => any> = Omit<ReturnType<T>, "meta">

