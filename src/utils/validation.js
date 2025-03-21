export const validateCPF = (cpf) => {
    cpf = cpf.replace(/[^\d]/g, ""); // Remove non-numeric characters
    if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Check length and repeated digits

    let sum = 0, remainder;
    for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    if (remainder !== parseInt(cpf[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
    remainder = (sum * 10) % 11;
    if (remainder === 10 || remainder === 11) remainder = 0;
    return remainder === parseInt(cpf[10]);
};

export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const validateRG = (rg) => {
    const rgRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}-?[0-9XxA-Za-z]?|\d{5,9}[0-9XxA-Za-z]?)$/;
    return rgRegex.test(rg);
};

export const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,11}$/; // Accepts 10 or 11 digits (e.g., 1234567890 or 12345678901)
        return phoneRegex.test(phone);
};
