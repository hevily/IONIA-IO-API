function convertDateToString(dateInstance) {
    // Convert Date() to '0000-00-00 00:00:00' format

    const year = dateInstance.getFullYear()
    let month = dateInstance.getMonth() + 1
    let date = dateInstance.getDate()
    let hours = dateInstance.getHours()
    let minutes = dateInstance.getMinutes()
    let seconds = dateInstance.getSeconds()

    if(month < 10) {
        month = '0' + month
    }

    if(date < 10) {
        date = '0' + date
    }

    if(hours < 10) {
        hours = '0' + hours
    }

    if(minutes < 10) {
        minutes = '0' + minutes
    }

    if(seconds < 10) {
        seconds = '0' + seconds
    }

    return `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
}

function operateDate(dateStr, operates) {
    const date = new Date(dateStr)

    for(const operate in operates) {
        switch(operate) {
            case 'year':
                date.setFullYear(date.getFullYear() + operates[operate])
                break
            case 'month':
                date.setMonth(date.getMonth() + operates[operate])
                break
            case 'day':
                date.setDate(date.getDate() + operates[operate])
                break
            case 'hours':
                date.setHours(date.getHours() + operates[operate])
                break
            case 'minutes':
                date.setMinutes(date.getMinutes() + operates[operate])
                break
            case 'seconds':
                date.setSeconds(date.getSeconds() + operates[operate])
                break
        }
    }

    return convertDateToString(date)
}


exports.convertDateToString = convertDateToString
exports.operateDate = operateDate