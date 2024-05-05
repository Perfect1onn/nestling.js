import { setMethodAndPath } from "./setMethodAndPath";

export function Patch(path: string = "/") {
	return function (
		target: any,
		propertyName: string,
		descriptor: PropertyDescriptor
	) {
		setMethodAndPath(descriptor.value, descriptor, path, "patch");
	};
}
