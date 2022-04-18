import { NextFunction, Request, Response } from 'express';
import url from 'url';
import convert from '../lib/cashify/convert';
import { Convert, ConvertQuery } from '../lib/quicktype/convertQuery';
//
//   const convertQuery = Convert.toConvertQuery(json);

// damn pitty :(
// import { convert } from 'cashify';
// Error [ERR_REQUIRE_ESM]: Must use import to load ES Module: E:\SideProjects\JS\TS Express NodeJS Quickstart\typescript-express-nodejs-quickstart\node_modules\cashify\dist\index.js
//console.log(convert(10, { from: 'EUR', to: 'GBP', base: 'EUR', rates }));

// rates with EUR base from 12.4. 2022, in case API doesn't work (limit reached etc..)
const rates = {
    AED: 3.991702,
    AFN: 96.197707,
    ALL: 121.013104,
    AMD: 517.084157,
    ANG: 1.965631,
    AOA: 476.753758,
    ARS: 122.316292,
    AUD: 1.461191,
    AWG: 1.956203,
    AZN: 1.849976,
    BAM: 1.954749,
    BBD: 2.202203,
    BDT: 94.042314,
    BGN: 1.955985,
    BHD: 0.40966,
    BIF: 2238.303266,
    BMD: 1.086779,
    BND: 1.487591,
    BOB: 7.498324,
    BRL: 5.102973,
    BSD: 1.090702,
    BTC: 0.000027005093,
    BTN: 82.851937,
    BWP: 12.558,
    BYN: 3.614019,
    BYR: 21300.872917,
    BZD: 2.198515,
    CAD: 1.374694,
    CDF: 2184.971113,
    CHF: 1.013878,
    CLF: 0.032188,
    CLP: 888.170582,
    CNY: 6.922895,
    COP: 4067.456022,
    CRC: 715.191224,
    CUC: 1.086779,
    CUP: 28.79965,
    CVE: 110.2056,
    CZK: 24.443953,
    DJF: 194.16356,
    DKK: 7.437537,
    DOP: 59.997937,
    DZD: 155.806844,
    EGP: 20.107743,
    ERN: 16.301694,
    ETB: 56.103319,
    EUR: 1,
    FJD: 2.286561,
    FKP: 0.833515,
    GBP: 0.835195,
    GEL: 3.336574,
    GGP: 0.833515,
    GHS: 8.289132,
    GIP: 0.833515,
    GMD: 58.63178,
    GNF: 9722.81471,
    GTQ: 8.370873,
    GYD: 228.188057,
    HKD: 8.516709,
    HNL: 26.769694,
    HRK: 7.550073,
    HTG: 119.429079,
    HUF: 377.81891,
    IDR: 15614.572288,
    ILS: 3.496973,
    IMP: 0.833515,
    INR: 82.729711,
    IQD: 1591.847353,
    IRR: 45970.761301,
    ISK: 139.618388,
    JEP: 0.833515,
    JMD: 168.414901,
    JOD: 0.770561,
    JPY: 136.476107,
    KES: 125.468561,
    KGS: 93.484816,
    KHR: 4412.301488,
    KMF: 491.386992,
    KPW: 978.101688,
    KRW: 1338.281968,
    KWD: 0.331457,
    KYD: 0.908802,
    KZT: 491.510555,
    LAK: 12950.660065,
    LBP: 1649.103553,
    LKR: 349.008686,
    LRD: 165.624456,
    LSL: 15.834859,
    LTL: 3.208977,
    LVL: 0.657382,
    LYD: 5.117295,
    MAD: 10.640616,
    MDL: 20.084682,
    MGA: 4410.682368,
    MKD: 61.653216,
    MMK: 2019.370187,
    MNT: 3128.590478,
    MOP: 8.805773,
    MRO: 387.979998,
    MUR: 47.198542,
    MVR: 16.801304,
    MWK: 891.030639,
    MXN: 21.574209,
    MYR: 4.600116,
    MZN: 69.369079,
    NAD: 15.834231,
    NGN: 451.687077,
    NIO: 39.034781,
    NOK: 9.567581,
    NPR: 132.565938,
    NZD: 1.589634,
    OMR: 0.418337,
    PAB: 1.090607,
    PEN: 4.0475,
    PGK: 3.843076,
    PHP: 56.594013,
    PKR: 199.427557,
    PLN: 4.654295,
    PYG: 7445.886698,
    QAR: 3.956973,
    RON: 4.941694,
    RSD: 117.747065,
    RUB: 90.846591,
    RWF: 1125.578139,
    SAR: 4.075785,
    SBD: 8.694284,
    SCR: 15.666538,
    SDG: 486.337469,
    SEK: 10.322665,
    SGD: 1.481851,
    SHP: 1.496927,
    SLL: 13204.367294,
    SOS: 629.244945,
    SRD: 22.447972,
    STD: 22494.135872,
    SVC: 9.542769,
    SYP: 2729.989794,
    SZL: 15.917101,
    THB: 36.559795,
    TJS: 13.638635,
    TMT: 3.814595,
    TND: 3.2348,
    TOP: 2.461336,
    TRY: 15.960494,
    TTD: 7.40694,
    TWD: 31.685267,
    TZS: 2523.501564,
    UAH: 32.065769,
    UGX: 3855.521889,
    USD: 1.086779,
    UYU: 45.88921,
    UZS: 12356.64297,
    VEF: 232386244478.43536,
    VND: 24876.376585,
    VUV: 124.019555,
    WST: 2.849585,
    XAF: 655.600618,
    XAG: 0.043412,
    XAU: 0.000555,
    XCD: 2.937075,
    XDR: 0.795368,
    XOF: 655.597603,
    XPF: 119.440234,
    YER: 272.04801,
    ZAR: 15.854436,
    ZMK: 9782.384122,
    ZMW: 19.086725,
    ZWL: 349.942469
};

const convertHealthCheck = (req: Request, res: Response, next: NextFunction) => {
    const queryObject = url.parse(req.url, true).query;
    console.log(queryObject);

    //const convertQuery = Convert.toConvertQuery(req.url);
    //console.log(`This is our new type safe query: ${convertQuery.amount}, ${convertQuery.from}, ${convertQuery.to}`);

    const from = queryObject.from;
    const to = queryObject.to;
    const amount = queryObject.amount;

    console.log(`We want to exchange ${amount} ${from} into ${to}`);

    const result = convert(JSON.stringify(amount), { from: 'EUR', to: 'GBP', base: 'EUR', rates });

    //const result = convert(1000, { from: 'EUR', to: 'GBP', base: 'EUR', rates });

    // let's try without a check so far
    console.log('result: ' + convert(JSON.stringify(amount), { from: 'EUR', to: 'GBP', base: 'EUR', rates }));

    return res.status(200).json({
        message: 'convert called',
        parsedQuery: { queryObject },
        result: result
    });
};

export default { convertHealthCheck };
