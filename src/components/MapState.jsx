export const mapstate = (state) => {
    switch (state) {
        case 'AT':
            return 'Austria';
        case 'BE':
            return 'Belgium';
        case 'CY':
            return 'Cyprus';
        case 'CZ':
            return 'Czech Republic';
        case 'DE':
            return 'Germany';
        case 'DK':
            return 'Denmark';
        case 'EE':
            return 'Estonia';
        case 'ES':
            return 'Spain';
        case 'FI':
            return 'Finland';
        case 'HU':
            return 'Hungary';
        case 'IE':
            return 'Ireland';
        case 'IS':
            return 'Iceland';
        case 'LT':
            return 'Lithuania';
        case 'LU':
            return 'Luxembourg';
        case 'LV':
            return 'Latvia';
        case 'MT':
            return 'Malta';
        case 'NL':
            return 'Netherlands';
        case 'NO':
            return 'Norway';
        case 'SE':
            return 'Sweden';
        case 'SK':
            return 'Slovakia';
        case 'SI':
            return 'Slovenia';
        case 'UK':
            return 'United Kingdom';
        case 'PL':
            return 'Poland';
        case 'PT':
            return 'Portugal';
        case 'FR':
            return 'France';
        case 'IT':
            return 'Italy';
        case 'EL':
            return 'Greece';
        case 'HR':
            return 'Croatia';
        case 'BG':
            return 'Bulgaria';
        case 'RO':
            return 'Romania';
        case 'TR':
            return 'Turkey';
        case 'MK':
            return 'North Macedonia';
        case 'RS':
            return 'Serbia';
        case 'ME':
            return 'Montenegro';
        case 'AL':
            return 'Albania';
        case 'XK':
            return 'Kosovo';
        case 'BA':
            return 'Bosnia and Herzegovina';
        case 'UA':
            return 'Ukraine';
        case 'MD':
            return 'Moldova';
        case 'BY':
            return 'Belarus';
        case 'RU':
            return 'Russia';
        case 'CH':
            return 'Switzerland';
        case 'LI':
            return 'Liechtenstein';
        case 'AD':
            return 'Andorra';
        case 'MC':
            return 'Monaco';
        case 'SM':
            return 'San Marino';
        case 'VA':
            return 'Vatican City';
        case 'IS':
            return 'Iceland';
        case 'NO':
            return 'Norway';
        default:
            return '';
    }
}

export const mapvalue = (value) => {
    if (value === null) return 'No data';
    return value.toString() + '%';
}