import { Router } from "express";
import { Methods } from "../routes";

interface Constructor {
	new (...args: any[]): any;
}

interface ForeignService {
	module: Constructor;
	injectController: boolean;
	injectService: boolean;
}

interface Options {
	controller: Constructor;
	service: Constructor;
	foreignServices?: ForeignService[];
	repository: Constructor;
}

export function Module({
	controller: Controller,
	service: Service,
	foreignServices = [],
	repository: Repostitory,
}: Options) {
	const foreignServiceInstances = foreignServices.reduce(
		(
			acc: { controllerServices: any[]; serviceServices: any[] },
			foreignService
		) => {
			if (foreignService.injectController) {
				acc.controllerServices.push(
					Object.getPrototypeOf(new foreignService.module()).service
				);
			}

			if (foreignService.injectService) {
				acc.serviceServices.push(
					Object.getPrototypeOf(new foreignService.module()).service
				);
			}
			return acc;
		},
		{
			controllerServices: [],
			serviceServices: [],
		}
	);

	/*
		Depedency injection
	*/
	const service = new Service(
		...foreignServiceInstances.serviceServices,
		new Repostitory()
	);
	const controller = new Controller(
		...foreignServiceInstances.controllerServices,
		service
	);

	return function (constructor: Function) {
		/*
			Добавление методов к роутеру
		*/
		const prototype = Object.getPrototypeOf(controller);
		const router = Router();

		for (let key in prototype) {
			if (typeof prototype[key] === "function") {
				const endpoint = prototype[key];
				const [path, method] = endpoint.pathname as [string, Methods];
				const methodMiddlewares = prototype[key].middlewares
					? prototype[key].middlewares
					: [];
				router[method](
					path,
					...methodMiddlewares,
					prototype[key].bind(controller)
				);
			}
		}

		/* 
			Добавление свойства к прототипу конструктора: router: [modulePath, controllerMiddleware, router]
		*/
		const controllerMiddlewares = prototype.middlewares;

		constructor.prototype["service"] = service;
		constructor.prototype["router"] = [
			prototype.path,
			...controllerMiddlewares,
			router,
		];
	};
}
