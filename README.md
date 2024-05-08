## Nestling.js - light version of Nest.js
Library for writing small medium-sized projects, supporting modular architecture

## Advantages of Nestling.js
1. **Lightweight Libary:** Nestling.js is a lightweight version of Nest.js, providing the same powerful features but with a smaller footprint. This makes it suitable for smaller projects or microservices where resource usage is critical.

2. **Type Safety:** Built with TypeScript, Nestling.js offers strong typing support throughout your application. This ensures better code quality, fewer runtime errors, and improved developer productivity through enhanced code completion and type checking.

3. **Modular Architecture:** Like its parent framework, Nestling.js follows a modular architecture that promotes code organization and reusability. It allows developers to divide their application into separate modules, each responsible for a specific feature or functionality.

4. **Dependency Injection:** Nestling.js utilizes the same dependency injection pattern as Nest.js, facilitating the creation of loosely coupled, testable components. This promotes cleaner code and makes it easier to manage dependencies within your application.

5. **Expressive Syntax:** Despite being lightweight, Nestling.js retains the expressive syntax of Nest.js, making it intuitive and easy to understand for developers familiar with the Nest ecosystem. This ensures a smooth learning curve for those transitioning from Nest.js to Nestling.js.

## Installation
You can install Nestling.js via npm:
```bash
npm install nestling.js
```

## Documentation

### Initializing the Application
To initialize your Nestling.js application, import the `Nestling` class and use its static create method. This method takes the application module (AppModule) as its first parameter and middleware as its second parameter. It returns an instance of the Express application.

```JavaScript
import { Nestling, json } from "nestling.js";
import { AppModule } from "./app.module";

const app = Nestling.create(AppModule, json());

const port = process.env.PORT || 3000;

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});
```
### Application Module
The application module (AppModule) is used to connect other modules in the application.

```JavaScript
import { AuthModule } from "./auth";
import { TestModule } from "./test";
import { UserModule } from "./user";

export class AppModule {
      userModule = new UserModule();
      authModule = new AuthModule();
      testModule = new TestModule();
}
```

### Module
To declare a class as a module, use the `@Module` decorator. This decorator takes an object with three mandatory properties: controller, service, and repository.

```JavaScript
import { Module } from "nestling.js";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserRepository } from "./repository/user.repository";

@Module({
	controller: UserController,
	service: UserService,
	repository: UserRepository
})
export class UserModule {}
```

Additionally, the foreignServices property can be used to inject external services.
1. `module` - Here you put the module whose service you want to use.
2. `injectController` - Takes a boolean value that determines whether the service will be injected into the controller.
3. `injectService` - Takes a boolean value that determines whether the service will be injected into another service.

```JavaScript
import { Module } from "nestling.js";
import { UserModule } from "../user";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./repository/auth.repository";

@Module({
	controller: AuthController,
	service: AuthService,
	repository: AuthRepository,
	foreignServices: [
		{ module: UserModule, injectController: false, injectService: true },
	],
})
export class AuthModule {}
```

### Controller 
To declare a class as a controller, use the `@Controller` decorator. It takes path and middlewares as arguments

```JavaScript
import { Controller, Get, Request, Response } from "nestling.js";
import { authMiddleware } from "../auth/middlewares";
import { UserService } from "./user.service";

@Controller("users", authMiddleware)
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Get()
	async getUsers(req: Request, res: Response) {
		console.log(req.body)
		return res.status(200).send(await this.userService.getUsers());
	}

	@Get(":id")
	async getUserById(req: Request, res: Response) {
		return res
			.status(200)
			.send(await this.userService.getUserById(+req.params.id));
	}
}
```

### Routing 
Routing in Nestling.js is achieved using decorators like Get, Post, Put, and Patch, which take path and middlewares as arguments.

```JavaScript
	@Post("signUp")
	async signUp(req: Request, res: Response) {
		try {
			const user = await this.authService.signUp(req.body);
			return res.status(201).send(user);
		} catch (error) {
			sendError(res, error);
		}
	}

	@Post("login")
	async login(req: Request, res: Response) {
		const { email, password } = req.body;
		try {
			const user = await this.authService.login(email, password);

			res.status(200).send(user);
		} catch (error) {
			sendError(res, error);
		}
	}
```


## How it works
