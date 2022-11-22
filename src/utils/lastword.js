export const LastWord = (string, className = "text-orange-500") => {
    const arrayFrom = [...string.split(' ')];
    arrayFrom[arrayFrom.length - 1] = `<span class="${className}">${arrayFrom[arrayFrom.length - 1]}</span>`
    const newString = arrayFrom.join(' ');
    return newString;
}