export const httpRequestFailureMessage = 'Oh dear! Something has gone wrong. Our engineering team is looking into it, please try again soon.';
export const successMessageDisplayDuration = 2000;

export function debounce(delay: number = 300): MethodDecorator {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const timeoutKey = Symbol();

    const original = descriptor.value;

    descriptor.value = function (...args) {
      clearTimeout(this[timeoutKey]);
      this[timeoutKey] = setTimeout(() => original.apply(this, args), delay);
    };

    return descriptor;
  };
}
