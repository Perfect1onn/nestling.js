import express, { type Express, Request, Response, NextFunction } from "express";

interface Constructor {
	new (...args: any[]): any;
}

export class Nestling {
	static create(
		AppModule: Constructor,
		...middlewares: ((req: Request, res: Response, next: NextFunction) => any)[]
	): Express {
		const app = express();

		middlewares.forEach((middleware) => {
			app.use(middleware);
		});
		/* 
		
			Добавление роутера модуля к роутеру приложения

			Пример:
			AppModule = {
				userModule: {...} => prototype => router: [ path , router ];
				authModule: {...} => prototype => router: [ path , router ];
			}

		 */
		const appModule = new AppModule();

		Object.entries(appModule).forEach(([moduleName, module]) => {
			console.log(`[module]: ${moduleName} is connected`);
			app.use(...Object.getPrototypeOf(module).router);
		});

		return app;
	}
}
