import type { BigSource, Big } from 'big.js';

type Rates = Record<string, number>;

interface Options {
    /**
     * Currency from which you want to convert.
     */
    from?: string;

    /**
     * Currency to which you want to convert.
     */
    to?: string;

    /**
     * Base currency.
     */
    base: string;

    /**
     * Object containing currency rates (for example from an API, such as Open Exchange Rates).
     */
    rates: Rates;

    /**
     * Optional, Big.js constructor - useful to avoid floating point errors.
     */
    BigJs?: new (value: BigSource) => Big;
}

/**
 * Function, which converts currencies based on provided rates.
 *
 * @param {number | string} amount - Amount of money you want to convert.
 * @param {Object} options - Conversion options.
 * @param {new (value: BigSource) => Big} fn - Optional, Big.js constructor - useful to avoid floating point errors.
 * @return {number} Conversion result.
 *
 * @example
 * const rates = {
 * 	GBP: 0.92,
 * 	EUR: 1.00,
 * 	USD: 1.12
 * };
 *
 * convert(10, {from: 'EUR', to: 'GBP', base: 'EUR', rates}); //=> 9.2
 */
export default function convert(amount: number | string, { from, to, base, rates, BigJs }: Options): number {
    // If provided `amount` is a string, use parsing
    if (typeof amount === 'string') {
        const data = parse(amount);

        amount = data.amount;
        from = data.from ?? from;
        to = data.to ?? to;
    }

    if (BigJs) {
        return new BigJs(amount).times(getRate(base, rates, from, to)).toNumber();
    }

    return (amount * 100 * getRate(base, rates, from, to)) / 100;
}

/**
 * Get the conversion rate.
 * @param base Base currency.
 * @param rates Object containing currency rates (for example from an API, such as Open Exchange Rates).
 * @param from Currency from which you want to convert.
 * @param to Currency to which you want to convert.
 * @return Conversion result.
 */
function getRate(base: string, rates: Rates, from: string | undefined, to: string | undefined): number {
    if (from && to) {
        // If `from` equals `to`, return 100% directly
        if (from === to) {
            return 1;
        }

        // If `from` equals `base`, return the basic exchange rate for the `to` currency
        if (from === base && hasKey(rates, to)) {
            return rates[to]!;
        }

        // If `to` equals `base`, return the basic inverse rate of the `from` currency
        if (to === base && hasKey(rates, from)) {
            return 1 / rates[from]!;
        }

        // Otherwise, return the `to` rate multipled by the inverse of the `from` rate to get the relative exchange rate between the two currencies.
        if (hasKey(rates, from) && hasKey(rates, to)) {
            return rates[to]! * (1 / rates[from]!);
        }

        throw new Error('The `rates` object does not contain either the `from` or `to` currency.');
    } else {
        throw new Error('Please specify the `from` and/or `to` currency, or use parsing.');
    }
}

/**
 * Check if an object contains a key.
 * @param obj The object to check.
 * @param key The key to check for.
 */
function hasKey<T>(object: Rates, key: string | number | symbol): key is keyof T {
    return Object.prototype.hasOwnProperty.call(object, key);
}

interface ParseOptions {
    amount: number;
    from: string | undefined;
    to: string | undefined;
}

/**
 * Expression parser
 *
 * @param {string} expression - Expression you want to parse, ex. `10 usd to pln` or `€1.23 eur`
 * @return {Object} Object with parsing results
 *
 * @example
 * parse('10 EUR to GBP'); //=> {amount: 10, from: 'EUR', to: 'GBP'}
 */
function parse(expression: string): ParseOptions {
    const amount = Number(expression.replace(/[^\d-.]/g, ''));
    let from;
    let to;

    // Search for separating keyword (case insensitive) to split the expression into 2 parts
    if (/to|in|as/i.test(expression)) {
        const firstPart = expression
            .slice(0, expression.search(/to|in|as/i))
            .toUpperCase()
            .trim();

        from = firstPart.replace(/[^A-Za-z]/g, '');
        to = expression
            .slice(expression.search(/to|in|as/i) + 2)
            .toUpperCase()
            .trim();
    } else {
        from = expression.replace(/[^A-Za-z]/g, '');
    }

    if (Number.isNaN(amount) || expression.trim().length === 0) {
        throw new Error('Could not parse the expression. Make sure it includes at least a valid amount.');
    }

    return {
        amount,
        from: from.toUpperCase() || undefined,
        to
    };
}
