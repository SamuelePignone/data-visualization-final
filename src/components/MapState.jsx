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

export const mapindtype = (ind_type) => {
    switch (ind_type) {
        case 'IND_TOTAL':
            return 'Average e-commerce usage';
        case 'Y16_24':
            return '16-24 years old e-commerce usage';
        case 'Y25_54':
            return '25-54 years old e-commerce usage';
        case 'Y55_74':
            return '55-74 years old e-commerce usage';
        case 'Y75_MAX':
            return '75 years and older e-commerce usage';
        default:
            return '';
    }
}
export const map_size_emp = (size_emp) => {
    switch (size_emp) {
        case '0-9':
            return 'Micro';
        case 'GE10':
            return 'Micro';
        case '1-9':
            return 'Micro';
        case '10-49':
            return 'Small';
        case '50-249':
            return 'Small and medium-sized';
        case 'GE250':
            return 'Large';
        default:
            return '';
    }
}

export const map_size_emp_to_number = (size_emp) => {
    switch (size_emp) {
        case '1-9':
            return 10;
        case 'GE10':
            return 25;
        case '10-49':
            return 50;
        case '50-249':
            return 75;
        case 'GE250':
            return 100;
        default:
            return 0;
    }
}

export const map_size_indic_is_ai = (indic_is) => {
    switch (indic_is) {
        case 'other':
            return 'Other';
        case 'E_AI_TIR':
            return 'AI and robotics';
        case 'E_AI_TML':
            return 'Machine learning';
        case 'E_AI_TTM':
            return 'Text and data mining';
        case 'E_BDAML':
            return 'Big data analytics';
        case 'E_CHTB':
            return 'Cloud technology';
        case 'E_RBTS':
            return 'Robotics';
        case 'no_data':
            return 'No data';
        default:
            return '';
    }
}

export const map_size_indic_is_ai_to_number = (indic_is) => {
    switch (indic_is) {
        case 'other':
            return 15;
        case 'E_AI_TIR':
            return 30;
        case 'E_AI_TML':
            return 45;
        case 'E_AI_TTM':
            return 60;
        case 'E_BDAML':
            return 75;
        case 'E_CHTB':
            return 90;
        case 'E_RBTS':
            return 100;
        case 'no_data':
            return -1;
        default:
            return 0;
    }
}

export const map_size_indic_is_sec = (indic_is) => {
    switch (indic_is) {
        case 'E_SECMSPSW':
            return 'Strong password authentication';
        case 'E_SECMKSUD':
            return 'Software updates';
        case 'E_SECMDENC':
            return 'Data encryption';
        case 'E_SECMOSBU':
            return 'Off-site data backup';
        case 'E_SECMNAC':
            return 'Network access control';
        case 'E_SECMVPN':
            return 'VPN usage';
        case 'E_SECMLOG':
            return 'Log file maintenance';
        case 'E_SECMRASS':
            return 'Risk assessment';
        case 'E_SECMTST':
            return 'Security testing';
        default:
            return '';
    }
}


export const map_code_to_description = (code) => {
    switch (code) {
        case 'E_AESELL':
            return 'E-commerce sales';
        case 'E_AESBHM':
            return 'E-commerce sales or purchases domestically';
        case 'E_AESEU':
            return 'E-commerce sales to other EU countries';
        case 'E_AESEUWW':
            return 'E-commerce sales to EU and worldwide';
        case 'E_AESWW':
            return 'Worldwide e-commerce sales';
        case 'E_AWSELL':
            return 'Web sales (websites, apps, marketplaces)';
        case 'E_AWS_B2BG':
            return 'Web sales B2B and B2G';
        case 'E_AXSELL':
            return 'EDI-type sales';
        case 'E_ESELL':
            return 'E-commerce sales ≥1% turnover';
        case 'E_AWS_CMP':
            return 'Sales via e-commerce marketplaces';
        case 'E_AWS_COWN':
            return 'Sales via own websites/apps';
        default:
            return '';
    }
}

export const map_dii_to_description = (dii) => {
    //['E_DI3_HI', 'E_DI3_LO', 'E_DI3_VHI', 'E_DI3_VLO']
    switch (dii) {
        case 'E_DI3_HI':
            return 'High digital intensity';
        case 'E_DI3_LO':
            return 'Low digital intensity';
        case 'E_DI3_VHI':
            return 'Very high digital intensity';
        case 'E_DI3_VLO':
            return 'Very low digital intensity';
        default:
            return '';
    }
}