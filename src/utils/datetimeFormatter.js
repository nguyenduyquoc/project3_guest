const formatDate = (dateString) => {
    const date = new Date(dateString);
    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const month = months[date.getMonth()];

    // Add leading zero for single-digit days
    const day = date.getDate().toString().padStart(2, '0');

    // Format the time as HH:mm AM/PM
    const time = date.toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit', hour12: true });

    // Format the date as "day Month, Year"
    const formattedDate = `${day} ${month}, ${date.getFullYear()}`;

    return { month, day, time, formattedDate };
};

export default formatDate;

/*
BIẾN ĐỔI MỘT CHUỖI NGÀY THÁNG ĐẦU VÀO THÀNH MỘT ĐỐI TƯỢNG CHỨA THÔNG TIN
VỀ THÁNG, NGÀY, GIỜ VÀ NGÀY ĐƯỢC ĐỊNH DẠNG THEO CÁCH CỤ THỂ
*/
