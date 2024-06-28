export default function formatDateWithSeconds(inputDate) {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const dateObj = new Date(inputDate);
    const year = dateObj.getFullYear();
    const month = months[dateObj.getMonth()];
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;

    const formattedDate = `${month} ${day}, ${year} At ${formattedHours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${period}`;

    return formattedDate;
}
