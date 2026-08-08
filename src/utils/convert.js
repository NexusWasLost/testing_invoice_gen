export const convertToPaise = function(rupees) {
    if (typeof rupees !== "number" || isNaN(rupees) || rupees < 0)
        return null;

    return Math.round(rupees * 100);
};
