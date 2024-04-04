export const mapstate = (state) => {
    console.log(state);
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
        default:
            return '';
    }
}

export const mapvalue = (value) => {
    if (value === null) return 'No data';
    return value.toString() + '%';
}