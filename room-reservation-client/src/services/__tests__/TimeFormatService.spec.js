import { describe, it, expect } from 'vitest';
import { formatDate, formatTime } from '../TimeFormatService'; // Adjust the path as needed

describe('formatDate', () => {
    it('should format a date correctly', () => {
        const inputDate = '2025-02-05T12:00:00Z'; // UTC time
        const expectedOutput = 'Wednesday, February 5, 2025';

        expect(formatDate(inputDate)).toBe(expectedOutput);
    });

    it('should handle different dates correctly', () => {
        const inputDate = '2024-12-25T00:00:00Z';
        const expectedOutput = 'Wednesday, December 25, 2024';

        expect(formatDate(inputDate)).toBe(expectedOutput);
    });

    it('should handle invalid date input', () => {
        expect(() => formatDate('testing invalid')).toThrow('Invalid date format');
    });
});

describe('formatTime', () => {
    it('should format a time correctly', () => {
        const inputDate = '2025-02-05T15:30:00Z'; // UTC time
        const expectedOutput = '3:30 PM';

        expect(formatTime(inputDate)).toBe(expectedOutput);
    });

    it('should handle midnight correctly', () => {
        const inputDate = '2025-02-05T00:00:00Z'; // Midnight UTC
        const expectedOutput = '12:00 AM';

        expect(formatTime(inputDate)).toBe(expectedOutput);
    });

    it('should handle invalid date input', () => {
        expect(() => formatTime('testing invalid')).toThrow('Invalid date format');
    });

});
