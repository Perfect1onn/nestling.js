import type { Methods } from "./types";
/*
	Декораторы роутинга добавляют в метод свойство pathname: [path, method]

	Например:
	@Get("/users")
	getUsers() {...}

	Подкапотом => getUsers.pathname["/users", "get"]

	Note: Декораторы выполянются снизу вверх.
*/
export function setMethodAndPath(
	callback: Function & { [key: string]: [string, Methods] },
	descriptor: PropertyDescriptor,
	path: string,
	method: Methods
) {
	callback["pathname"] = [
		path === "/" ? path : "/" + path,
		method,
	];
	descriptor.enumerable = true;
}
