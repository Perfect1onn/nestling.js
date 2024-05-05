import type { NextFunction, Request, Response } from "express";
/* 

  Декоратор контроллера. Позволяет указать путь модуля и добавить миддлавары для каждого эндоинта.
  Путь и миддлвары помещаются непосредственно в прототип функции конструктора контроллера.

  const userController = new UserController(...)
  userController.__proto__["path"] = "/users"
  userController.__proto__["middlewares"] = [fn]

  Декоратор модуля проходится по userController.__proto__ те свойства которые являются функциями 
  добавляет в роутер и их миддлвары(Не миддлвары контроллера).

  Note: Метод при указании декораторов роутинга или миддлвар добавляют свойства  в метод: {pathname: [path, method]} 

  Пример: const router = new Router()
  const Method = userController.__proto__[fn]
  router[pMethod.pathname[1]](Method.pathname[0], ...Method.middlewares, Method)

  После декоратор модуля добавляет в прототип функции конструктора модуля в свойство router: 
  [userController.__proto__["path"], ...userController.__proto__["middlewares"], router];
  
*/
export function Controller(
	path: string = "/",
	...midlewares: ((req: Request, res: Response, next: NextFunction) => void)[]
) {
	return function (constructor: Function) {
		constructor.prototype["path"] = path === "/" ? path : "/" + path;
		constructor.prototype["middlewares"] = midlewares;
	};
}
