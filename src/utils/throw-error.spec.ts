import { describe, expect, it } from '@jest/globals';

import { throwError } from './throw-error.js';

describe('throwError', () => {
  it('should return a function', () => {
    const result = throwError('some error');

    expect(typeof result).toBe('function');
  });

  it('should not throw when called without invoking the returned function', () => {
    expect(() => {
      throwError('no throw yet');
    }).not.toThrow();
  });

  it('should throw when the returned function is called', () => {
    const thrower = throwError('boom');

    expect(() => {
      thrower();
    }).toThrow();
  });

  it('should throw an Error instance', () => {
    const thrower = throwError('an error message');

    expect(() => {
      thrower();
    }).toThrow(Error);
  });

  it('should throw with the provided message', () => {
    const message = 'something went wrong';
    const thrower = throwError(message);

    expect(() => {
      thrower();
    }).toThrow(new Error(message));
  });

  it('should throw with an empty string message', () => {
    const thrower = throwError('');

    expect(() => {
      thrower();
    }).toThrow(new Error(''));
  });

  it('should throw with a long message', () => {
    const message = 'a'.repeat(1000);
    const thrower = throwError(message);

    expect(() => {
      thrower();
    }).toThrow(new Error(message));
  });

  it('should produce independent functions for different messages', () => {
    const throwerA = throwError('error A');
    const throwerB = throwError('error B');

    expect(() => throwerA()).toThrow(new Error('error A'));
    expect(() => throwerB()).toThrow(new Error('error B'));
  });

  it('should throw a new Error each time the returned function is called', () => {
    const thrower = throwError('repeated');
    let firstError: Error | undefined;
    let secondError: Error | undefined;

    try {
      thrower();
    } catch (error) {
      firstError = error as Error;
    }

    try {
      thrower();
    } catch (error) {
      secondError = error as Error;
    }

    expect(firstError).toBeInstanceOf(Error);
    expect(secondError).toBeInstanceOf(Error);
    expect(firstError).not.toBe(secondError);
    expect(firstError?.message).toBe('repeated');
    expect(secondError?.message).toBe('repeated');
  });
});
