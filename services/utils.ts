export const formattedDate = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

export const formattedFullDate = (date: Date | string) => {
    if (!date) return "";
    if (typeof date === "string") {
        date = new Date(date);
    }
    return `${formattedDecimal(date.getDate())}/${formattedDecimal(date.getMonth() + 1)}/${date.getFullYear()} ${formattedDecimal(date.getHours())}:${formattedDecimal(date.getMinutes())}:${formattedDecimal(date.getSeconds())}`;
}

export const formattedFullDateToSupabase = (date: Date) => {
    if (!date) return "";
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}

export const formattedDecimal = (value: number) => {
    if (value >= 10) 
        return value;
    return `0${value}`;
}