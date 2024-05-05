import type { NextFunction, Request, Response } from "express";

/*
	Декоратор миддлвары добавляет в метод свойство middlewares: [fn, fn, fn].


	Note: Сначала выполняютсся миддлвары контроллера только потом метода.
	Note: Декораторы выполянются снизу вверх.
*/
export function Middleware(
	...midlewares: ((req: Request, res: Response, next: NextFunction) => void)[]
) {
	return function (
		target: any,
		propertyName: string,
		descriptor: PropertyDescriptor
	) {
		descriptor.value["middlewares"]
			? descriptor.value["middlewares"].push(...midlewares)
			: (descriptor.value["middlewares"] = [...midlewares]);
	};
}
